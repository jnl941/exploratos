package com.example.fileFetcher.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.fileFetcher.entity.User;

@EnableJpaRepositories
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")

public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String username);
}

