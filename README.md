# DeepIntent.js

## Overview

Deep Intent is a small javascript library that makes it easy to prepopulate a tweet **inside** the twitter application, essentially deep linking a tweet intent.  If a user taps a "tweet this" link on IOS, they'll go into the twitter application to finalize and send their tweet.  On Android, users will have the option to open a browser window on twitter.com or open the application.  Desktop users will just get a prepopulated tweet on twitter.com.

## Installation

Simply use bower

`bower install deep-intent`

and/or include the script on your page

`<script src="path/to/deepIntent.js"></script>`

## Usage

Links you want to use to prepopulate tweets need a selector and an attribute to hold the tweet.  Ex: `<a href="#" class="js-deep-intent" data-tweet="Check out this neat article guise">Tweet Mah Article</a>`

Then initialize DeepIntent using the init method, which takes two options: your chosen class as a selector and an options object. Note that you feed init a class name, so `class-name` works while `.class-name` doesn't

`DeepIntent.init('selector', {options})`