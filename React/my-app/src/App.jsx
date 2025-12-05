import React, { useState, useEffect } from 'react';

function App() {
  // 1. 데이터를 담을 그릇 만들기 (초기값은 비어있음)
  const [data, setData] = useState({ message: "", author: "" });
  const [like, setLike] = useState(0);
  // 2. 화면이 켜지자마자 Spring Boot에 전화 걸기
  useEffect(() => {
    fetch("http://localhost:8080/api/test") // 스프링부트 주소
      .then((res) => res.json()) // "데이터를 JSON으로 바꿔줘"
      .then((json) => {
        setData(json); // "받은 데이터를 그릇에 담아!"
      });
  }, []); // []는 '처음 한 번만 실행하라'는 뜻

  

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>React + Spring Boot 연결 성공! 🎉</h1>
      
      {/* 3. 받아온 데이터 보여주기 */}
      <h2>메시지: {data.message}</h2>
      <h3>작성자: {data.author}</h3>
      <h1>{like}</h1>
      <button onClick={() => setLike(like + 1)}>like</button>
      <button onClick={() => setLike(like - 1)}>dislike</button>
    </div>
  );
}

export default App;