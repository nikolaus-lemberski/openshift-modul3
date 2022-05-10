package com.redhat.developer.demo.tasks;

import org.springframework.data.annotation.Id;

import lombok.Data;

@Data
public class Task {
    
    @Id
    private Long id;
    private String description;
    private boolean done;
    
}
