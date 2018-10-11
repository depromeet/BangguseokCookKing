# MyExpressGenerator

npm express-generator처럼 자신만의 generator를 구축하고자 한다.



## 목차

**Table of Contents**  generated with [DocToc](https://github.com/thlorenz/doctoc)

- [MyExpressGenerator](#myexpressgenerator)
  - [디렉토리 구조](#%EB%94%94%EB%A0%89%ED%86%A0%EB%A6%AC-%EA%B5%AC%EC%A1%B0)
  - [MVC 패턴 적용](#mvc-%ED%8C%A8%ED%84%B4-%EC%A0%81%EC%9A%A9)
    - [Router example](#router-example)
    - [Controller example](#controller-example)
    - [Model example](#model-example)
  - [디자인 패턴](#%EB%94%94%EC%9E%90%EC%9D%B8-%ED%8C%A8%ED%84%B4)
    - [NODE_ENV 환경변수에 따른 서버 환경 설정 변경](#node_env-%ED%99%98%EA%B2%BD%EB%B3%80%EC%88%98%EC%97%90-%EB%94%B0%EB%A5%B8-%EC%84%9C%EB%B2%84-%ED%99%98%EA%B2%BD-%EC%84%A4%EC%A0%95-%EB%B3%80%EA%B2%BD)
    - [컨트롤러에 async 적용](#%EC%BB%A8%ED%8A%B8%EB%A1%A4%EB%9F%AC%EC%97%90-async-%EC%A0%81%EC%9A%A9)
    - [express-async-wrap을 사용해 라우터에서의 오류처리](#express-async-wrap%EC%9D%84-%EC%82%AC%EC%9A%A9%ED%95%B4-%EB%9D%BC%EC%9A%B0%ED%84%B0%EC%97%90%EC%84%9C%EC%9D%98-%EC%98%A4%EB%A5%98%EC%B2%98%EB%A6%AC)
    - [await-to-js를 사용해 가독성을 높인 await 오류처리](#await-to-js%EB%A5%BC-%EC%82%AC%EC%9A%A9%ED%95%B4-%EA%B0%80%EB%8F%85%EC%84%B1%EC%9D%84-%EB%86%92%EC%9D%B8-await-%EC%98%A4%EB%A5%98%EC%B2%98%EB%A6%AC)
  - [코드 컨벤션](#%EC%BD%94%EB%93%9C-%EC%BB%A8%EB%B2%A4%EC%85%98)



## 디렉토리 구조

```
.
├── app
│   ├── controllers
│   ├── helpers
│   ├── models
│   ├── routes
│   └── views
├── app.js
├── bin
│   └── www
├── config
│   └── config.js
├── ecosystem.json
└── public
```

- controllers: 각 routes의 핸들러를 정의하는 곳입니다.
- helpers: 프로젝트 내에서 사용하는 사용자 정의 모듈이나 함수를 정의하는 곳입니다.
- models: 데이터 모델을 정의하고 비즈니스 로직을 정의하는 곳입니다.
- views: 웹 서비스의 뷰를 담당하는 파일들을 모아둡니다.
- app.js: express의 객체를 생성하고 미들웨어 설정을 정의하는 곳입니다.
- bin/www: 서버의 시작 파일입니다.
- config: 설정 파일들을 모아둡니다.
- ecosystem.json: pm2 모듈로 서비스를 구동할 때 사용합니다.
- public: 프로젝트의 정적 파일들을 관리하는 곳입니다.  



## MVC 패턴 적용

정확히 말하자면 MVRC(Model, View, Router, Controller)로 프로젝트를 분할하여 관리합니다. 

- Model: 모델 객체와 그것의 비즈니스 로직을 정의합니다.
- View: express의 템플릿 엔진에 따라 ejs, pug 파일 등을 관리합니다.
- Router: url에 따라 컨트롤러의 메소드를 사용하고 url들을 관리하는 곳입니다. 
- Controller: 각 url Router마다 핸들러를 정의합니다. 



각 Model, Router, Controller마다 같은 이름을 가진 파일들이 있고 그 파일들마다 연관성이 존재해야합니다.

#### Router example

```javascript
// UserRouter.js
'use strict';

const express = require('express');
const router = express.Router();
const wrap = require('express-async-wrap');

const UserCtrl = require('../controllers/UserCtrl');	// 컨트롤러 객체

router.route('/users/register')
	.post(wrap(UserCtrl.register)); // 회원가입

module.exports = router;
```



#### Controller example

```javascript
// UserCtrl.js
'use strict';

const userSchema = require('../models/UserSchema');
const to = require('await-to-js').default;

exports.register = async(req, res, next) => {
    let userData = {
        uid: req.body.uid,
        name: req.body.name,
        password: req.body.password
    };

    let [err, userDoc] = await to(userSchema.register(userData));
    if(err)
    	throw err;
    
    res.json({
        "success": true,
        "code": 200,
        "message": "회원가입이 완료되었습니다.",
        "time": new Date()
    })
};
```



#### Model example

```javascript
// userModel.js
'use strict';

const mongoClient = require('mongoose');
const to = require('await-to-js').default;

const UserSchema = new mongoClient.Schema({
   uid: {
      type: String,
       required: true,
       unique: true
   },
   name: {
      type: String,
      required: true
   },
   password: {
      type: String,
      required: true
   },
   createOn: Date
});

// 회원가입 메서드
UserSchema.statics.register = function(userData) {
   return new Promise(async function (resolve, reject) {
      let [errCreate, userDoc] = await to(this.create(userData));
      if(errCreate) {
        errCreate.message = "회원가입을 실패하였습니다."; reject(errCreate);
      }
      
      resolve(userDoc);
   }.bind(this))
};

module.exports = mongoClient.model('user', UserSchema);
```



## 디자인 패턴

#### NODE_ENV 환경변수에 따른 서버 환경 설정 변경

서버 환경변수 NODE_ENV 값에 따라 config의 값을 변경한다. exports된 config를 노드 서버의 환경 변수로써 사용할 수 있게된다.



**example**

```javascript
'use strict';

// required environment variables
	[
		'NODE_ENV'
	].forEach((name) => {
	if (!process.env[name]) {
		throw new Error(`Environment variable ${name} is missing`)
	}
});
const config = {};

if(process.env.NODE_ENV === "dev") {
	config.server = {
		PORT: 3000
	}
} else if(process.env.NODE_ENV === "prod") {
	config.server = {
		PORT: 8080
	}
}

module.exports = config;
```





#### 컨트롤러에 async 적용

**예제 확인**: [Controller example](#controller-example)

컨트롤러에 async를 적용함으로써 컨트롤러 내부의 promise 함수들에게 await를 사용할 수 있다.

코드 가독성이 증가한다.



#### express-async-wrap을 사용해 라우터에서의 오류처리

라우팅 핸들러 즉, Controller에서 async/await에서 발생한 에러를 throw를 통해 에러 핸들링 미들웨어로 넘겨 처리할 수 있게 된다.

**예제 확인**: [Controller example](#controller-example)

**참조**: [express.js 라우팅 핸들러에 async/await을 적용할 수 있을까?](https://programmingsummaries.tistory.com/399)

**모듈**: npm express-async-wrap



#### await-to-js를 사용해 가독성을 높인 await 오류처리

await-to-js를 사용하여 promise가  resolve인지 reject인지 es6의 비구조화 할당을 통해 한번에 받을 수 있다.

**example**

```javascript
const to = require('await-to-js').default;

// 프로미스를 to 함수로 감싼다.
let [err, userDoc] = await to(userSchema.register(userData));
if(err) {
	err.message = "회원가입을 실패하였습니다."; throw err;
}
```

**모듈**: npm await-to-js



## 코드 컨벤션

