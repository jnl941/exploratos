package com.example.fileFetcher.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.fileFetcher.entity.Comment;

@EnableJpaRepositories
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")

public interface CommentRepository extends JpaRepository<Comment, Long> {
    List<Comment> findByFileId(Long fileId);
}
