package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import java.util.HashMap;
import java.util.Map;

@RestController
public class HelloController {

    // 중요! origins = "*" 는 "누구든지 다 들어와도 좋다"는 뜻입니다.
    // 포트 번호 신경 쓸 필요 없이 테스트할 때 가장 편한 설정입니다.
    @CrossOrigin(origins = "*") 
    @GetMapping("/api/test")
    public Map<String, String> sayHello() {
        HashMap<String, String> data = new HashMap<>();
        data.put("message", "안녕하세요!");
        data.put("author", "양윤성");
        
        return data;
    }
}