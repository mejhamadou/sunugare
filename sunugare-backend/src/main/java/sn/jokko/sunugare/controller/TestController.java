package sn.jokko.sunugare.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestController {

    @GetMapping("/protected")
    public ResponseEntity<?> protectedRoute() {
        return ResponseEntity.ok(Map.of(
                "message", "Félicitations ! Tu as accédé à une route protégée.",
                "status", "Authentifié"
        ));
    }
}