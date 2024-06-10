package com.example.fileFetcher.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.fileFetcher.entity.CustomFile;

@EnableJpaRepositories
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")

public interface CustomFileRepository extends JpaRepository<CustomFile, Long> {
    public Optional<CustomFile> findByPath(String path);
}

