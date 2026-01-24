export const ANALYSIS_CONFIG = {
  // New Signal-Based Parameters
  signals: {
    recency: {
      windowDays: 90,
      activeThreshold: 3 // Number of active repos to be considered "Active"
    },
    complexity: {
      sizeThreshold: 1000, // KB
      deepProjectCountSatisfactory: 2
    },
    validation: {
      starValue: 1,
      forkValue: 2,
      goodscore: 50
    },
    consistency: {
      targetActiveMonths: 8 // Out of 12
    }
  },

  // Language lists kept for "Top Stack" analysis
  languages: {
      backend: [
        "Python", "Java", "Go", "Rust", "C++", "C#", "C", 
        "PHP", "Ruby", "Scala", "Elixir", "Erlang", "Clojure", 
        "Haskell", "OCaml", "Julia", "R", "F#", "Lua", "Perl", 
        "Shell", "PowerShell", "SQL", "Solidity", "Zig", "Nim", 
        "Fortran", "Ada", "Assembly", "Crystal"
      ],
      frontend: [
        "JavaScript", "TypeScript", "HTML", "CSS", "SCSS", 
        "Sass", "Less", "Stylus", "Vue", "Svelte", "Elm", 
        "Dart", "Swift", "Kotlin", "Objective-C", 
        "CoffeeScript", "PureScript", "Reason"
      ]
  },
  
  // Keywords for stack detection help
  nameKeywords: {
      backend: [
        "api", "server", "backend", "service", "worker", "job", "cron", 
        "db", "database", "schema", "model", "controller", "route", "core", 
        "algo", "system", "config", "util", "lib", "net", "network", 
        "socket", "proto", "grpc", "graphql", "sql", "query", "script"
      ],
      frontend: [
        "react", "web", "ui", "frontend", "client", "app", "view", 
        "page", "component", "widget", "style", "css", "theme", "design", 
        "layout", "vue", "angular", "svelte", "next", "nuxt", "gatsby", 
        "vite", "webpack", "rollup", "parcel", "dashboard", "admin", 
        "landing", "portfolio", "mobile", "ios", "android"
      ]
  }
};
