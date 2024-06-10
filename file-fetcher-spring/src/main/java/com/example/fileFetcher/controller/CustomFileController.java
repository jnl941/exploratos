package com.example.fileFetcher.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.fileFetcher.dto.CommentDTO;
import com.example.fileFetcher.dto.CustomFileDTO;
import com.example.fileFetcher.entity.Comment;
import com.example.fileFetcher.entity.CustomFile;
import com.example.fileFetcher.entity.User;
import com.example.fileFetcher.services.CommentService;
import com.example.fileFetcher.services.CustomFileService;
import com.example.fileFetcher.services.FileService;
import com.example.fileFetcher.services.UserService;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/savedfiles")
public class CustomFileController {
    @Autowired
    private CustomFileService fileService;
    @Autowired
    private CommentService commentService;
    @Autowired
    private UserService userService;


    @GetMapping("/")
    public ResponseEntity<List<CustomFileDTO>> getFiles() {
        List<CustomFile> allFiles = fileService.getAllFiles();
        if(allFiles.size() == 0){
            ArrayList<CustomFileDTO> filesDTOs = new ArrayList<>();
            for(CustomFile file : allFiles){
                filesDTOs.add(convertToDto(file));
            }
            return ResponseEntity.ok(filesDTOs);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @GetMapping("/{fileId}")
    public ResponseEntity<CustomFileDTO> getFile(@PathVariable Long fileId) {
        CustomFile file = fileService.findById(fileId)
                .orElseThrow(() -> new RuntimeException("File not found"));
        CustomFileDTO fileDTO = convertToDto(file);
        return ResponseEntity.ok(fileDTO);
    }
    @PostMapping("/{fileId}")
    public ResponseEntity<CustomFileDTO> addFile(@PathVariable Long fileId, @RequestBody Map<String,String> request) {
            CustomFile file = new CustomFile();
            file.setId(fileId);
            file.setName(request.get("name"));
            file.setPath(request.get(request.get("path")));
            file.setOwner(request.get("owner"));
            file.setContent(request.get("content"));
            return ResponseEntity.ok(convertToDto(fileService.save(file)));
    }

    @GetMapping("/{fileId}/comments")
    public ResponseEntity<List<CommentDTO>> getFileComments(@PathVariable Long fileId) {
        List<Comment> comments = commentService.findByFileId(fileId);
        List<CommentDTO> commentDTOs = comments.stream().map(this::convertToDto).collect(Collectors.toList());
        return ResponseEntity.ok(commentDTOs);
    }

    @PostMapping("/{fileId}/comments")
    public ResponseEntity<CustomFileDTO> addComment(@PathVariable Long fileId, @RequestBody Map<String,String> request) {
        Comment comment = new Comment();
        return fileService.findById(fileId).map(file -> {
            comment.setFile(file);
            comment.setUser((userService.findById(Long.valueOf(request.get("userId"))).get()));
            comment.setText(request.get("text"));
            commentService.save(comment);
            return ResponseEntity.ok(convertToDto(file));
        }).orElseGet(() -> {
            CustomFile file = new CustomFile();
            file.setId(fileId);
            file.setName(request.get("fileName"));
            file.setPath(request.get(request.get("path")));
            file.setOwner(request.get("fileOwner"));
            file.setContent(request.get("content"));
            CustomFile newFile = fileService.save(file);
            comment.setFile(newFile);
            comment.setUser((userService.findById(Long.valueOf(request.get("userId"))).get()));
            comment.setText(request.get("text"));
            commentService.save(comment);

            return ResponseEntity.ok(convertToDto(newFile));
        });
    }


    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long commentId) {
        commentService.deleteById(commentId);
        return ResponseEntity.noContent().build();
    }

    private CustomFileDTO convertToDto(CustomFile file) {
        CustomFileDTO fileDTO = new CustomFileDTO();
        fileDTO.setId(file.getId());
        fileDTO.setName(file.getName());
        fileDTO.setPath(file.getPath());
        fileDTO.setOwner(file.getOwner());
        fileDTO.setContent(file.getContent());
        //fileDTO.setComments(file.getComments().stream().map(this::convertToDto).collect(Collectors.toList()));
        return fileDTO;
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
