/**
 * Created by owenchen on 15-12-31.
 */

var exports = module.exports = {};
var request = require('request');
var fs = require('fs');
var cheerio = require('cheerio');


exports.getPlaces = function(city, callback) {

    //URLS ---------------------------------------------------------------------------
    var cache_url = "./htmlcache/";


    if(city == "Toronto")
    {
        var base_url = 'http://www.tripadvisor.ca/Attractions-g155019-Activities-';
        var location_url = 'Toronto_Ontario.html';
    }
    else if(city == "Waterloo")
    {
        var base_url = 'https://www.tripadvisor.ca/Attractions-g154993-Activities-';
        var location_url = 'Region_of_Waterloo_Ontario.html';
    }
    else if(city == "New York City")
    {
        var base_url = 'https://www.tripadvisor.ca/Attractions-g60763-Activities-';
        var location_url = 'New_York_City_New_York.html';
    }
    else if(city == "Mississauga")
    {
        var base_url = 'https://www.tripadvisor.ca/Attractions-g154996-Activities-';
        var location_url = 'Mississauga_Ontario.html';
    }
    else if(city == "London")
    {
        var base_url = 'https://www.tripadvisor.ca/Attractions-g186338-Activities-';
        var location_url = 'London_England.html';
    }
    else if(city == "Liverpool")
    {
        var base_url = 'https://www.tripadvisor.ca/Attractions-g186337-Activities-';
        var location_url = 'Liverpool_Merseyside_England.html';
    }
    else
    {
        var base_url = 'http://www.tripadvisor.ca/Attractions-g155019-Activities-';
        var location_url = 'Toronto_Ontario.html';
    }


    //Download/cache the html if it does not exist
    if (fs.existsSync(cache_url + location_url)) {
        console.log("Html already exist!");

        fs.readFile(cache_url + location_url, 'utf8', function (err,file) {
            if (err) {
                return console.log(err);
            }
            var $ = cheerio.load(file);
            var title, rating, rank, total_reviews, lazy_url, img_url, review;

            var json = [{title : "", rating: "", rank: "", total_reviews: "", image_url: "", review: ""}];

            var lazyimg = [{imgurl: "", lazyloadurl: ""}];
            var dict = {};

            //Get all the image links and lazy load links
            $('script').each(function(i, elem){
                var data = $(this);
                var substring = "lazyImgs";

                if(data.text().indexOf(substring) > -1)
                {
                    var re = /\"data(.*)scroll\"/g;
                    var arr;

                    var count = 0;
                    while ((arr = re.exec(data.text())) !== null) {
                        lazyimg.push({});
                        lazyimg[count].imgurl = arr[0].substring(8, arr[0].length - 10);
                        count++;
                    }

                    re = /\"id(.*)priority\"/g;
                    var arr2;

                    count = 0;
                    while ((arr2 = re.exec(data.text())) !== null) {
                        lazyimg[count].lazyloadurl = arr2[0].substring(6, arr2[0].length - 12);
                        count++;
                    }


                    for( i = 0; i < lazyimg.length; i++)
                    {
                        dict[lazyimg[i].lazyloadurl] = lazyimg[i].imgurl;
                    }
                }
            });

            $('.element_wrap').each(function(i, elem){
                var data = $(this);

                //get the title
                title = data.children().first().children().eq(1).children().first().children().first().text();
                if(title == undefined || title == "")
                {
                    title = 'n/a';
                }

                //get the rank
                rank = data.children().first().children().eq(1).children().eq(1).text();
                if(rank === undefined || rank == "")
                {
                    rank = 'n/a';
                }
                else
                {
                    var split = rank.split(" ");
                    rank = split[0].slice(2);
                }

                //get the rating
                rating = data.children().first().children().eq(1).children().eq(3).children().first().children().first().attr('class');
                if(rating === undefined|| rating == "")
                {
                    rating = 'n/a';
                }
                else
                {
                    rating = rating.slice(-2);
                }

                //get the total reviews
                total_reviews = data.children().first().children().eq(1).children().eq(3).children().first().children().eq(1).children().first().text();
                if(total_reviews === undefined || total_reviews == "")
                {
                    total_reviews = "n/a";
                }
                else
                {
                    var split = total_reviews.split(" ");
                    total_reviews = split[0].slice(1);
                }

                //get the lazy id
                lazy_url = data.children().first().children().first().children().first().children().first().attr('id');
                img_url = dict[lazy_url];
                if(img_url == undefined)
                {
                    img_url = data.children().first().children().first().children().first().children().first().children().first().children().first().children().first().attr('src');
                }

                review = data.children().first().children().eq(1).children().eq(4).children().first().children().first().children().first().text();
                if(review == undefined)
                {
                    review = "";
                }

                console.log(img_url);
                // Once we have our data, we'll store it to the our json object.
                json.push({});
                json[i].title = title;
                json[i].rank = rank;
                json[i].rating = rating;
                json[i].total_reviews = total_reviews;
                json[i].image_url = img_url;
                json[i].review = review;
            });



            ////write to output.json
            //fs.writeFile('output.json', JSON.stringify(json, null, 4), function(err){
            //
            //    console.log('File successfully written! - Check your project directory for the output.json file');
            //
            //})

            callback(json);
        });
    }
    else
    {
        request(base_url + location_url, function(error, res, html) {
            if(!error) {
                fs.writeFile(cache_url + location_url, html, function (err) {
                    if (err) {
                        console.log(err);
                    }
                    console.log("The html was saved!");

                    var $ = cheerio.load(html);
                    var title, rating, rank, total_reviews, image_url;

                    var result = [];
                    var json = [{title: "", rating: "", rank: "", total_reviews: "", image_url: ""}];


                    $('.element_wrap').each(function (i, elem) {
                        var data = $(this);

                        //get the title
                        title = data.children().first().children().eq(1).children().first().children().first().text();
                        if (title == undefined || title == "") {
                            title = 'n/a';
                        }

                        //get the rank
                        rank = data.children().first().children().eq(1).children().eq(1).text();
                        if (rank === undefined || rank == "") {
                            rank = 'n/a';
                        }
                        else {
                            var split = rank.split(" ");
                            rank = split[0].slice(2);
                        }

                        //get the rating
                        rating = data.children().first().children().eq(1).children().eq(3).children().first().children().first().attr('class');
                        if (rating === undefined || rating == "") {
                            rating = 'n/a';
                        }
                        else {
                            rating = rating.slice(-2);
                        }

                        //get the total reviews
                        total_reviews = data.children().first().children().eq(1).children().eq(3).children().first().children().eq(1).children().first().text();
                        if (total_reviews === undefined || total_reviews == "") {
                            total_reviews = "n/a";
                        }
                        else {
                            var split = total_reviews.split(" ");
                            total_reviews = split[0].slice(1);
                        }

                        //get the image url
                        image_url = data.children().first().children().first().children().first().children().first().attr('src');


                        // Once we have our data, we'll store it to the our json object.
                        json.push({});
                        json[i].title = title;
                        json[i].rank = rank;
                        json[i].rating = rating;
                        json[i].total_reviews = total_reviews;
                    });


                    callback(json);
                });
            }
        });
    }


};

