package com.example.fileFetcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.fileFetcher.dto.UserDTO;
import com.example.fileFetcher.entity.User;
import com.example.fileFetcher.services.UserService;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/findUsers")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping("/{username}")
    public ResponseEntity<UserDTO> getUserByUsername(@PathVariable String username) {
        User user = userService.findByUsername(username);
        if (user != null) {
            return ResponseEntity.ok(new UserDTO(user.getId(), user.getUsername()));
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    // @GetMapping("/{userId}")
    // public ResponseEntity<UserDTO> getUserByUserId(@PathVariable Long userId) {
    //     User user = userService.findById(userId).get();
    //     if (user != null) {
    //         return ResponseEntity.ok(new UserDTO(user.getId(), user.getUsername()));
    //     } else {
    //         return ResponseEntity.notFound().build();
    //     }
    // }
}
