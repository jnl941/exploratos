package com.example.fileFetcher.services;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;
import org.springframework.stereotype.Component;

import com.example.fileFetcher.dto.ArticleDto;
import com.example.fileFetcher.dto.WikiDto;

@Component("articlesDataService")


public class ArticlesService {
    public static String removeReferences(String text) {
        // Regular expression to match references in square brackets
        String pattern = "\\[[0-9]+(?:,[0-9]+)*\\]";
        
        // Compile the pattern
        Pattern compiledPattern = Pattern.compile(pattern);
        
        // Create matcher from the pattern
        Matcher matcher = compiledPattern.matcher(text);
        
        // Replace all matches with an empty string
        String cleanedText = matcher.replaceAll("");
        
        // Remove any extra spaces left after removal of references
        cleanedText = cleanedText.replaceAll("\\s+", " ").trim();
        
        return cleanedText;
    }
    public List<ArticleDto> retrieveGithubArticles() {
        try {
            List<ArticleDto> results = new ArrayList<>();
            Document webPage = Jsoup.connect("https://github.blog/category/product/").get();
            Elements termPosts = webPage.select("article[id^=term-post]");
            for(Element termPost : termPosts){
                ArticleDto article = new ArticleDto();
                article.title = termPost.select("a").get(1).text();
                article.text = termPost.select("p").get(0).text();
                
                results.add(article);
            }
            return results;
        } catch (IOException e) {
            e.printStackTrace();
        }
        return null;
    }
}
