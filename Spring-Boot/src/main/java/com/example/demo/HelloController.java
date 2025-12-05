package com.example.demo;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {

    @GetMapping("/")
    public String hello() {
        return "안녕하세요! 스프링 부트 성공입니다! 🎉";
    }

    // 기존 코드는 그대로 두고, 이 부분을 아래에 추가하세요
    @GetMapping("/test")
    public String test() {
        return "여기는 테스트 페이지입니다! 🚀";
    }
}