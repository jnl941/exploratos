package com.example.fileFetcher.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.fileFetcher.entity.Comment;
import com.example.fileFetcher.repository.CommentRepository;

import java.util.List;
import java.util.Optional;

@Service
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")

public class CommentService {
    @Autowired
    private CommentRepository commentRepository;

    public List<Comment> findByFileId(Long fileId) {
        return commentRepository.findByFileId(fileId);
    }

    public Optional<Comment> findById(Long id) {
        return commentRepository.findById(id);
    }

    public Comment save(Comment comment) {
        return commentRepository.save(comment);
    }

    public void deleteById(Long id) {
        commentRepository.deleteById(id);
    }
}

