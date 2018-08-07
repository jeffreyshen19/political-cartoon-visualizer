# Political Cartoon Visualizer
An exploration of the late 1800s through political cartoons of the era. Developed for an internship with the Library of Congress Labs as a demonstration of Cartoon Drawings Collection. 

The Library of Congress's Cartoon Drawings Collection provides hundreds of historical political cartoons, dating mostly from the late 1800s to early 1900s. These cartoons can be accessed using the [Library's Official API](https://libraryofcongress.github.io/data-exploration/), and come with rich metadata on their date, artist, and a list of "subjects"—manually entered categories from the curators of the collection. I wanted too see if these cartoons told a story of the late 1800s. Were certain cartoons frequently referenced in conjunction with others? Do cartoons coincide with major historical events? How are famous figures of that era represented in cartoon form? 

These questions and more I seek to answer in this interactive web experience / data visualization. My hope is that you, the viewer, will walk away with a better understanding of the late 1800s and a desire to further explore the Library of Congress's rich collections. 

## Table of Contents 

* **assets**: Contains all the front-end assets like fonts. 
* **data**: Contains all the parsed data which is displayed on the website.
* **dist**: Contains all the minified CSS and JS displayed on the website.
* **parser**: Contains the Node.js code which processes the raw data and outputs it in ./data.
* **src**: Contains the raw SCSS, JS, and Pug (an HTML preprocessor) code.

## Documentation 

All documentation for this project is available in the [docs](./docs) folder. 

## Get Involved

## Credits 

### Authors

Built by [Jeffrey Shen](http://jeffreyshen.com), then a high school senior at Phillips Academy Andover (Class of 2019). 

### Acknowledgements 

Special thanks to Jaime Mears, Jamie Bresner, Elaine Kamlley, and everyone in [LC Labs](https://labs.loc.gov/) who helped me with this project.

### Datasets Used

This project is buit off the [Library of Congress's Cartoon Drawing](https://www.loc.gov/collections/cartoon-drawings/?fa=online-format:image%7Caccess-restricted:false) Dataset.

### Built With

All software used in the development of this project is open source. See the [package.json](package.json) for the full list. 

### License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
