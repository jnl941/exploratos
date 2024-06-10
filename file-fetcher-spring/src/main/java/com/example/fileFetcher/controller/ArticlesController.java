package com.example.fileFetcher.controller;
import java.io.FileWriter;
import java.io.IOException;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.nodes.Element;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.fileFetcher.dto.ArticleDto;
import com.example.fileFetcher.services.ArticlesService;
import com.google.gson.Gson;
import com.google.gson.JsonIOException;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/articles")
public class ArticlesController {

    @Autowired
    private ArticlesService articlesService;

        private Gson gson = new Gson();

    
    @GetMapping("/githubArticles")
    
    public ResponseEntity<List<ArticleDto>> getVegetarianismoData() {
        List<ArticleDto> result = articlesService.retrieveGithubArticles();
        try {
            
            gson.toJson(result, new FileWriter("dataArticles"));
        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<List<ArticleDto>>(result,
                HttpStatus.OK);
    }
    
}