package com.example.fileFetcher.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.example.fileFetcher.dto.CommentDTO;
import com.example.fileFetcher.dto.UserDTO;
import com.example.fileFetcher.entity.Comment;
import com.example.fileFetcher.entity.User;
import com.example.fileFetcher.repository.UserRepository;

import java.util.Optional;
import java.util.stream.Collectors;

@Service
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")

public class UserService {
    @Autowired
    private UserRepository userRepository;

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    public User findByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public User save(User user) {
        return userRepository.save(user);
    }

    public UserDTO getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return convertToDto(user);
    }

    private UserDTO convertToDto(User user) {
        UserDTO userDTO = new UserDTO();
        userDTO.setId(user.getId());
        userDTO.setUsername(user.getUsername());
        userDTO.setComments(user.getComments().stream().map(this::convertToDto).collect(Collectors.toList()));
        return userDTO;
    }

    private CommentDTO convertToDto(Comment comment) {
        CommentDTO commentDTO = new CommentDTO();
        commentDTO.setId(comment.getId());
        commentDTO.setText(comment.getText());
        commentDTO.setUserId(comment.getUser().getId());
        commentDTO.setFileId(comment.getFile().getId());
        return commentDTO;
    }
}

