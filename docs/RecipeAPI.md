# 방구석 요리왕 API 문서



- [방구석 요리왕 API 문서](#%EB%B0%A9%EA%B5%AC%EC%84%9D-%EC%9A%94%EB%A6%AC%EC%99%95-api-%EB%AC%B8%EC%84%9C)
  - [레시피 생성 요청](#%EB%A0%88%EC%8B%9C%ED%94%BC-%EC%83%9D%EC%84%B1-%EC%9A%94%EC%B2%AD)
  - [레시피 삭제 요청](#%EB%A0%88%EC%8B%9C%ED%94%BC-%EC%82%AD%EC%A0%9C-%EC%9A%94%EC%B2%AD)
  - [레시피 한 개의 정보 요청](#%EB%A0%88%EC%8B%9C%ED%94%BC-%ED%95%9C-%EA%B0%9C%EC%9D%98-%EC%A0%95%EB%B3%B4-%EC%9A%94%EC%B2%AD)



## 레시피 생성 요청

### POST /recipe

- 등록하고 싶은 자취 레시피의 정보를 전달해 생성하는 요청



### Request

- 헤더(header)

  | 키           | 벨류                | 설명 |
  | ------------ | ------------------- | ---- |
  | content-type | multipart/form-data |      |



- 바디(body) : form-data

| 키                    | 설명                             | 타입          | 비고                           |
| --------------------- | -------------------------------- | ------------- | ------------------------------ |
| recipe                | 메인 레시피에 사용할 썸네일      | file          |                                |
| subRecipe             | 레시피 설명에 사용할 이미지 다수 | file 배열     |                                |
| //author              | 레시피 작성자 이름               | String        | 이 필드는 서버에서 처리할 것임 |
| title                 | 레시피의 제목                    | String        |                                |
| ingredientList        | 레시피 재료 배열                 | Array(String) | ["계란 3알", "물 반컵"]        |
| subRecipeList         | 레시피 세부 설명 객체의 배열     | Array(Object) |                                |
| subRecipeList.order   | 레시피 세부 설명 객체의 순번     | Number        |                                |
| subRecipeList.comment | 레시피 세부 설명 객체의 설명     | String        |                                |

예)

```javascript
{
    recipe: ["파일1"],
    subRecipe: ["파일2-1", "파일2-2"]
    title: "계란찜",
	//author: "김민호",
	ingredientList: ["계란 3알", "물 반컵"],
	subRecipeList: [{
		order: 1,
		comment:  "test 코멘트"
	}, {
		order: 2,
		comment:  "test 코멘트2"
	}]
}
```



### Response

### 200 OK

- 헤더(header)
- 바디(body): json 타입

| 키      | 설명                     | 타입    | 비고         |
| ------- | ------------------------ | ------- | ------------ |
| success | 성공 여부                | boolean |              |
| code    | 서버 코드                | Number  | 200이면 성공 |
| message | 서버에서 전달하는 메세지 | String  |              |
| time    | 서버 응답 시간           | Date    |              |

- 예제

```javascript
{
    "success": true,
    "messsage": "레시피 등록 완료",
    "code": 200,
    "time": "10/4/2018"
}
```



## 레시피 삭제 요청

### DELETE /recipe/:recipeId

- 삭제하고 싶은 레시피의 아이디를 url에 추가하여 요청하면 데이터베이스에서 정보 삭제
- :recipeId => 레시피 정보에서 데이터를 받을 때  _id의 값

### Request

- 헤더(header)

  | 키           | 벨류             | 설명 |
  | ------------ | ---------------- | ---- |
  | content-type | application/json |      |

- 바디(body)

### Response

### 200 OK

- 헤더(header)
- 바디(body): json 타입

| 키      | 설명                     | 타입    | 비고         |
| ------- | ------------------------ | ------- | ------------ |
| success | 성공 여부                | boolean |              |
| code    | 서버 코드                | Number  | 200이면 성공 |
| message | 서버에서 전달하는 메세지 | String  |              |
| time    | 서버 응답 시간           | Date    |              |

- 예제

```javascript
{
    "success": true,
    "messsage": "레시피 삭제 완료",
    "code": 200,
    "time": "10/4/2018"
}
```



## 레시피 한 개의 정보 요청

### GET /recipe/:recipeId

- 레시피의 전체 정보를 요구하는 API를 서버에 요청. 레시피 정보를 클릭했을 때 요청해야하는 API.
- :recipeId => 레시피 정보에서 데이터를 받을 때  _id의 값

### Request

### Response

### 200 OK

- 헤더(header)
- 바디(body): json 타입

| 키                           | 설명                                       | 타입          | 비고                                          |
| ---------------------------- | ------------------------------------------ | ------------- | --------------------------------------------- |
| success                      | 성공 여부                                  | boolean       |                                               |
| code                         | 서버 코드                                  | Number        | 200이면 성공                                  |
| message                      | 서버에서 전달하는 메세지                   | String        |                                               |
| time                         | 서버 응답 시간                             | Date          |                                               |
| data                         | 레시피 정보 객체                           | Object        |                                               |
| data.like                    | 레시피 객체의 좋아요 수                    | Number        |                                               |
| data.ingredientList          | 레시피 객체의 재료 목록 배열               | Array(String) |                                               |
| data.thumbnail               | 레시피 객체의 메인 썸네일                  | String        | 도메인 + url로 요청하면 사진을 받을 수 있다.  |
| data._id                     | 레시피 객체의 아이디 값.(pk값)             | String        | 데이터베이스의 pk값                           |
| data.subRecipeList           | 레시피 객체의 레시피 세부 설명 객체 리스트 | Array(Object) |                                               |
| data.subReipceList.thumbnail | 레시피 세부 설명 객체의 썸네일             | String        | 도메인 + url로 요청하면 사진을 받을 수 있다.  |
| data.subRecipeList.order     | 레시피 세부 설명 객체의 순번               | Number        | 이 순서대로 레시피 세부 설명을 Visualize한다. |
| data.subRecipeList.comment   | 레시피 세부 설명 객체의 설명               | String        |                                               |

- 예제

```javascript
{
    "success": true,
    "code": 200,
    "message": "레시피 찾기 완료",
    "data": {
        "like": 0,
        "ingredientList": [
            "계란 3알",
            "물 반컵"
        ],
        "thumbnail": "/images/1539868021623-KakaoTalk_Photo_2018-08-08-17-17-08.png",
        "subRecipeList": [
            {
                "thumbnail": "/test1",
                "_id": "5bc88575467b8a3994010481",
                "order": 1,
                "comment": "test 코멘트"
            },
            {
                "thumbnail": "/test2",
                "_id": "5bc88575467b8a3994010482",
                "order": 2,
                "comment": "test 코멘트2"
            }
        ],
        "_id": "5bc88575467b8a3994010483",
        "title": "계란찜",
        "__v": 0
    },
    "time": "2018-10-20T06:34:13.616Z"
}
```

