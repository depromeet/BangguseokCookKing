# 방구석 요리왕 API 문서

## 목차

- [방구석 요리왕 API 문서](#%EB%B0%A9%EA%B5%AC%EC%84%9D-%EC%9A%94%EB%A6%AC%EC%99%95-api-%EB%AC%B8%EC%84%9C)
  - [재료 태그에 맞는 레시피 리스트 응답](#%EC%9E%AC%EB%A3%8C-%ED%83%9C%EA%B7%B8%EC%97%90-%EB%A7%9E%EB%8A%94-%EB%A0%88%EC%8B%9C%ED%94%BC-%EB%A6%AC%EC%8A%A4%ED%8A%B8-%EC%9D%91%EB%8B%B5)



## 재료 태그에 맞는 레시피 리스트 응답

### GET /ingredient

- 레시피 재료 이름과 쿼리 문자열이 같은 레시피들을 찾고 싶을 때 요청하는 API



### Request

- 쿼리(url query)

  | 키   | 벨류              | 설명                                                    |
  | ---- | ----------------- | ------------------------------------------------------- |
  | tag  | <입력하는 문자열> | 찾고싶은 레시피 재료에 포함되는 쿼리 문자열을 입력한다. |

### Response

### 200 OK

- 헤더(header)
- 바디(body): json 타입

| 키                  | 설명                           | 타입          | 비고                                         |
| ------------------- | ------------------------------ | ------------- | -------------------------------------------- |
| success             | 성공 여부                      | boolean       |                                              |
| code                | 서버 코드                      | Number        | 200이면 성공                                 |
| message             | 서버에서 전달하는 메세지       | String        |                                              |
| time                | 서버 응답 시간                 | Date          |                                              |
| data                | 레시피 정보 객체               | Object        |                                              |
| data.title          | 레시피 객체의 레시피 이름      | String        |                                              |
| data.like           | 레시피 객체의 좋아요 수        | Number        |                                              |
| data.comment        | 레시피 객체의 댓글 수          | Number        |                                              |
| data.level          | 레시피 객체의 난이도           | Number        |                                              |
| data.author         | 레시피 객체의 작성자 이름      | String        |                                              |
| data.ingredientList | 레시피 객체의 재료 목록 배열   | Array(String) |                                              |
| data.thumbnail      | 레시피 객체의 메인 썸네일      | String        | 도메인 + url로 요청하면 사진을 받을 수 있다. |
| data._id            | 레시피 객체의 아이디 값.(pk값) | String        | 데이터베이스의 pk값                          |

- 예제

```javascript
// 입력한 tag = 계란 => 레시피 중 계란이 포함되는 레시피들 리스트가 반환된다.
{
    "success": true,
    "code": 200,
    "message": "레시피 찾기 완료",
    "data": [
        {
            "like": 0,
            "comment": 0,
            "level": 1,
            "ingredientList": [
                "계란 5개",
                "소금 약간",
                "대파 약간",
                "식용유 약간"
            ],
            "thumbnail": "/images/1540206714583-thumbnail2.png",
            "_id": "5bcdb07e260fe677aba94933",
            "title": "계란말이",
            "author": "홍길순",
            "__v": 0
        },
        {
            "like": 0,
            "comment": 0,
            "level": 3,
            "ingredientList": [
                "계란 6개",
                "소금 약간",
                "설탕 약간",
                "대파 약간",
                "뚝배기",
                "물 1/3컵"
            ],
            "thumbnail": "/images/1540207065779-thumbnail1.png",
            "_id": "5bcdb1dc260fe677aba94952",
            "title": "계란찜",
            "author": "금난새",
            "__v": 0
        }
    ],
    "time": "2018-10-22T12:04:05.269Z"
}
```

