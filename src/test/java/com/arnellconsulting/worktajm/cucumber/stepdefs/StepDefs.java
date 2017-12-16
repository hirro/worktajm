package com.arnellconsulting.worktajm.cucumber.stepdefs;

import com.arnellconsulting.worktajm.WorktajmApp;

import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.ResultActions;

import org.springframework.boot.test.context.SpringBootTest;

@WebAppConfiguration
@SpringBootTest
@ContextConfiguration(classes = WorktajmApp.class)
public abstract class StepDefs {

    protected ResultActions actions;

}
