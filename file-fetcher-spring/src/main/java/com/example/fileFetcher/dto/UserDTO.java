package com.example.fileFetcher.dto;

import java.util.ArrayList;
import java.util.List;

public class UserDTO {
    private Long id;
    private String username;
    private List<CommentDTO> comments;
    public UserDTO() {
    }
    public UserDTO(Long id, String username) {
        this.id = id;
        this.username = username;
        this.comments = new ArrayList<CommentDTO>();
    }
    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }
    public String getUsername() {
        return username;
    }
    public void setUsername(String username) {
        this.username = username;
    }
    public List<CommentDTO> getComments() {
        return comments;
    }
    public void setComments(List<CommentDTO> comments) {
        this.comments = comments;
    }
}
