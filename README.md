SmartyGrid
==========

SmartyGrid is a jQuery plugin and provides a user interface component. ([GitHub WebSite](https://samejack.github.com/SmartyGrid))

### AJAX WebService Specification

#### HTTP Request

HTTP Method = GET, example as follows:

```
GET http://domain/web-service.php?offset=20&size=5&sorts[title]=DESC&columns[]=username&columns[]=title&columns[]=email HTTP/1.1
```

| URL Paramater    | Type              | Description |
| :-------------   | :-------------    | :------ |
| size             | Integer           | Size of return rows |
| offset           | Integer           | Start offset of table |
| columns[]        | String[]          | Return columns |
| search[]         | String[]          | It's search keywork |
| equals[%Colume%] | String[]          | Column value filter |
| sorts[%Colume%]  | String (ASC&#124;DESC) | Sort column and rule |

#### HTTP Response ###

Web service must return the JSON format (Web + Json = Good), Content-type = application/json, example as follows:

```
{
    "code":0,
    "message":"success",
    "data":{
        "list":[
            {"username":"sj","title":"Bug Maker","email":"sj@gg.com"},
            {"username":"david","title":"Developer","email":"david@yahoo.com"},
            {"username":"fins","title":"Developer","email":"fins@msn.com"},
            {"username":"steve","title":"CEO","email":"jobs@heaven.com"},
            {"username":"dog","title":"-","email":"dogman@gmail.com"}
        ],
        "total":36
    }
}
```

### CSS Framework Supported

* Bootstrap 2
* Bootstrap 3

### Version & Release Note

1.0.0

### License

Apache License Version 2.0
