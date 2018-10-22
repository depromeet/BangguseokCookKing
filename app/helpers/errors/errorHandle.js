'use strict';
const mongoError = require('./MongoError');
const ClientError = require('./ClientError');

module.exports = function (err, req, res, next) {
    // TODO: 에러 내용 로그에 출력
    if(err instanceof mongoError || err instanceof ClientError) {
        console.error(err);
        res.json({
            "success": false,
            "code": err.status,
            "message": err.myMessage,
            "time": Date.now()
        })
    } else {
    	console.error(err);
        // set locals, only providing error in development
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // render the error page
        res.status(err.status || 500);
        res.render('error');
    }
};