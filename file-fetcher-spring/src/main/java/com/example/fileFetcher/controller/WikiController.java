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

import com.example.fileFetcher.dto.WikiDto;
import com.example.fileFetcher.services.WikiService;
import com.google.gson.Gson;
import com.google.gson.JsonIOException;

@RestController
@CrossOrigin(originPatterns = "*", allowCredentials = "true", allowedHeaders = "*")
@RequestMapping("/wiki")
public class WikiController {

    @Autowired
    private WikiService wikiService;

        private Gson gson = new Gson();

    
    
    @GetMapping("/vegetarianismo")
    public ResponseEntity<WikiDto> getVegetarianismoData() {
        WikiDto result = wikiService.retrieveWikiVegetarianismoData();
        try {
            
            gson.toJson(result, new FileWriter("dataWikiVegetarianismo"));
        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<WikiDto>(result,
                HttpStatus.OK);
    }
    @GetMapping("/veganismo")
    public ResponseEntity<WikiDto> getVeganismoData() {
        WikiDto result = wikiService.retrieveWikiVeganismoData();
        try {
            gson.toJson(result, new FileWriter("dataWikiVeganismo"));
        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<WikiDto>(result,
                HttpStatus.OK);
    }
    @GetMapping("/lowfodmap")
    public ResponseEntity<WikiDto> getLowFodmapData() {
        WikiDto result = wikiService.retrieveWikiLowFodmapData();
        try {
            gson.toJson(result, new FileWriter("dataWikiLowFodmap"));
        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<WikiDto>(result,
                HttpStatus.OK);
    }
    @GetMapping("/gluten")
    public ResponseEntity<WikiDto> getGlutenData() {
        WikiDto result = wikiService.retrieveWikiGlutenData();
        try {
            gson.toJson(result, new FileWriter("dataWikiGluten"));
        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<WikiDto>(result,
                HttpStatus.OK);
    }
    @GetMapping("/lacteo")
    public ResponseEntity<WikiDto> getLacteoData() {
        WikiDto result = wikiService.retrieveWikiLacteoData();
        try {
            gson.toJson(result, new FileWriter("dataWikiLacteo"));
        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<WikiDto>(result,
                HttpStatus.OK);
    }
    @GetMapping("/cetogenico")
    public ResponseEntity<WikiDto> getCetogenicoData() {
        WikiDto result = wikiService.retrieveWikiCetogenicoData();
        try {
            gson.toJson(result, new FileWriter("dataWikiCetogenico"));
        } catch (JsonIOException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        }
        return new ResponseEntity<WikiDto>(result,
                HttpStatus.OK);
    }
}