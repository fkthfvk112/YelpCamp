module.exports = func =>{
    return (req, res, next)=>{
        func(req, res, next).catch(next);
    }
}//에러가 예상되는 부분을 감쌀 함수