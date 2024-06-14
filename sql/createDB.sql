create database hustory;

use hustory;

drop database hustory;

CREATE TABLE story (
    storyId INT AUTO_INCREMENT PRIMARY KEY,
    storyName VARCHAR(255) NOT NULL,
    storyIntro TEXT,
    storyRating DECIMAL(3,2),
    storyAuthor VARCHAR(255),
    storyImg VARCHAR(255),
    storyStatus VARCHAR(50),
    views INT DEFAULT 0
);

CREATE TABLE chapter (
    chapterId INT AUTO_INCREMENT PRIMARY KEY,
    storyId INT NOT NULL,
    chapterNumber VARCHAR(50) NOT NULL,
    chapterName VARCHAR(255),
    chapterContent TEXT,
    publishTime TIMESTAMP,
    FOREIGN KEY (storyId) REFERENCES story(storyId)
);

CREATE TABLE user_t (
    userId INT AUTO_INCREMENT PRIMARY KEY,
    userName VARCHAR(255) NOT NULL,
    userAccount VARCHAR(255) NOT NULL UNIQUE,
    userPassword VARCHAR(255) NOT NULL,
    userAvatar VARCHAR(255),
    userBirthday DATE,
    userAddress VARCHAR(255),
    userJoinDate DATE NOT NULL,
    facebookURL VARCHAR(255),
	wattpadURL VARCHAR(255),
	redditURL VARCHAR(255),
    userBio TEXT
);

CREATE TABLE category(
	categoryId INT NOT NULL PRIMARY KEY,
	categoryName VARCHAR(255) NOT NULL
);

CREATE TABLE story_category (
    storyId INT NOT NULL,
    categoryId INT NOT NULL,
    FOREIGN KEY (storyId) REFERENCES story(storyId),
    FOREIGN KEY (categoryId) REFERENCES category(categoryId)
);

CREATE TABLE user_follow_story (
    userId INT NOT NULL,
    storyId INT NOT NULL,
    FOREIGN KEY (userId) REFERENCES user_t(userId),
    FOREIGN KEY (storyId) REFERENCES story(storyId)
);


