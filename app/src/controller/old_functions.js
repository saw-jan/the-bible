const electron = require('electron');
const app = require('electron').remote.app;
const $ = require('jquery');
const path = require('path');
const fs = require('fs');
const ipc = electron.ipcRenderer;
window.jQuery = window.$ = $;

//read user setting
const user =  require(path.join(app.getAppPath(),'../','config','settings.json'));
//set scripture font and sup font from setting files
let scriptureFont= user.scriptureFont;
let supFont= user.supFont;
//set bible version from setting file
let bible = user.bibleVersion+".sqlite";
let bibleCode = user.bibleVersion;
//function to set user's default setting
function setDefault(bVersion, tFont,sFont){
    const setting_path = path.join(app.getAppPath(),'../','config','settings.json');
    let new_sett = { 
        "scriptureFont":tFont,
        "supFont":sFont,
        "bibleVersion": bVersion 
    }; 
    //write into setting file
    fs.writeFile(setting_path, JSON.stringify(new_sett), err => { 
        if (err) throw err;
    }); 
}

//global variables
let book = 1;
let chapter = 1;
let verse = 1;
//bible-chorus-verse element
let BCV = document.getElementById('b-c-v');
let scripture = document.getElementById('scriptures');
let verseNumbers = document.getElementById('verse-numbers');
let chapterNumbers = document.getElementById('chapter-numbers');

//connection to bible data file
let dbPath = path.join(app.getAppPath(), '../', 'lib', bible);
let knex = require('knex')({
    client: 'sqlite3',
    connection: {
        filename: dbPath
    },
    useNullAsDefault: true
});
let meta=[];
    knex('metadata').select('value')
        .then((res) => {
            for (row of res) {

                meta.push(row.value);
            }
            $('#copyright-scripture').text('');
            $('#copyright-scripture').text('Scripture Text © '+meta[2]);
            $('.which-bible').text(meta[2]+' ('+meta[1]+')');
        });
//initial bible books load on startup
document.addEventListener('DOMContentLoaded', function() {
    loadBible();
})
//load bible on change
function loadBible(){
    BCV.innerHTML = "";
    scripture.innerHTML = "";
    verseNumbers.innerHTML = "";
    chapterNumbers.innerHTML = "";

    let oldBooks = document.getElementById('old-books');
    oldBooks.innerHTML='';
    knex('books').where('testament_id', 1).select('id','book_name')
        .then((rows) => {
            for (row of rows) {
                oldBooks.innerHTML += '<li id="b' + row.id + '">' + row.book_name.toString() + '</li>';
            }
            $('.book-list ul #b'+book).addClass("active-book");
    });
    let newBooks = document.getElementById('new-books');
    newBooks.innerHTML='';
    knex('books').where('testament_id', 2).select('id','book_name')
        .then((rows) => {
            for (row of rows) {
                newBooks.innerHTML += '<li id="b' + row.id + '">' + row.book_name.toString() + '</li>';
            }
            $('.book-list ul #b'+book).addClass("active-book");
    });
    
    //load default or recent
    knex('verses').distinct('chapter').where('book_id', book)
                .then((rows) => {
                    for (row of rows) {
                        chapterNumbers.innerHTML += "<span id='c" + row.chapter + "'>" + isNep(row.chapter) + "</span>";
                    }
                    $('.chapter-numbers #c'+chapter).addClass("active-c-v");
                });
    knex('verses').select('verse').where({ 'book_id': book, 'chapter': chapter })
                .then((rows) => {
                    for (row of rows) {
                        verseNumbers.innerHTML += "<span id='ve" + row.verse + "'>" + isNep(row.verse) + "</span>";
                    }
                    $('.verse-numbers #ve'+verse).addClass("active-c-v");
                });
    knex.select('book_name', 'chapter', 'verse', 'scripture').from('verses').innerJoin('books','verses.book_id','books.book_id').where({ 'verses.book_id': book, 'chapter': chapter })
                .then((rows) => {
                    let tVerse=0;
                    for (row of rows) {
                        scriptures.innerHTML += "<p id='v" + row.verse + "'><sup>" + isNep(row.verse) + "</sup> <span class='intend-txt'>" + row.scripture + "</span></p>";
                        tVerse = row.verse;
                    }
                    BCV.innerHTML = row.book_name + " " + isNep(row.chapter) + ": "+isNep(1)+" - " + isNep(tVerse);
                    //maintain text zoom
                    $('.scripture p').css('fontSize',scriptureFont);
                    $('.scripture sup').css('fontSize',supFont);
    });
}
//change bible version
function changeBible(newBible){
    bible = newBible+".sqlite";
    dbFile = path.join(app.getAppPath(), '../', 'lib', bible);
    knex = require('knex')({
        client: 'sqlite3',
        connection: {
            filename: dbPath
        },
        useNullAsDefault: true
    });
}
function isNep(number){
    let selValue = $('select.bible-version').children("option:selected").val();
    if(selValue=='NNRV'){
        let numArr = number.toString().split('');
        let nepNum = '';
        for (let i = 0; i < numArr.length; i++) {
            if (numArr[i] === '0') {
            nepNum += '०';
            } else if (numArr[i] === '1') {
            nepNum += '१';
            } else if (numArr[i] === '2') {
            nepNum += '२';
            } else if (numArr[i] === '3') {
            nepNum += '३';
            } else if (numArr[i] === '4') {
            nepNum += '४';
            } else if (numArr[i] === '5') {
            nepNum += '५';
            } else if (numArr[i] === '6') {
            nepNum += '६';
            } else if (numArr[i] === '7') {
            nepNum += '७';
            } else if (numArr[i] === '8') {
            nepNum += '८';
            } else if (numArr[i] === '9') {
            nepNum += '९';
            }
        }
        return nepNum.toString();
    }else{
        return number.toString();
    }
}
function plusFont() {
    scriptureFont+=3
    supFont+=2
    if(scriptureFont>17 && scriptureFont<=29){
        $('#m-plus img').css('opacity',.8);
        $('#m-minus img').css('opacity',.8);
        $('.scripture p').css('fontSize',scriptureFont);
        $('.scripture sup').css('fontSize',supFont);
    }
    if(scriptureFont>=29){
        scriptureFont=29;
        supFont=18;
        $('#m-plus img').css('opacity',.2);
    }
}
function minusFont() {
    scriptureFont-=3
    supFont-=2
    if(scriptureFont>=17){
        $('#m-minus img').css('opacity',.8);
        $('#m-plus img').css('opacity',.8);
        $('.scripture p').css('fontSize',scriptureFont);
        $('.scripture sup').css('fontSize',supFont);
    }
    if(scriptureFont<=17){
        scriptureFont=17;
        supFont=10;
        $('#m-minus img').css('opacity',.2);
    }
}
$(document).ready(function() {
    
    if(scriptureFont>=29){
        $('#m-plus img').css('opacity',.2);
    }
    if(scriptureFont<=17){
        $('#m-minus img').css('opacity',.2);
    }
    $('.scripture p').css('fontSize',scriptureFont);
    $('.scripture sup').css('fontSize',supFont);
    //font magnify
    $('#m-plus').on('click', function(){
        plusFont();
    });
    $('#m-minus').on('click', function(){
        minusFont();
    });
    //bible language select
    let selValue='';
    $('select.bible-version option[value='+bibleCode+']').attr('selected','selected');
    $("select.bible-version").change(function(){
        selValue = $(this).children("option:selected").val();
        changeBible(selValue);
        loadBible();
        
        //copyright text
        knex('metadata').select('value').where('key','copyright')
        .then((res) => {
            for (row of res) {
                copyright = row.value;
                $('#copyright-scripture').text('');
                $('#copyright-scripture').text('Scripture Text © '+copyright);
                //alert(copyright);
            }
        });

        if(selValue === 'NNRV' ){
            $('#old-testament').text('पुरानाे करार');
            $('#new-testament').text('नयाँ करार');
            $('.chapter .header').text('अध्याय');
            $('.verse .header').text('पद');
            $('.which-bible').text('Nepali New Revised Version (NNRV)');
        }else{
            $('#old-testament').text('Old Testament');
            $('#new-testament').text('New Testament');
            $('.chapter .header').text('Chapter');
            $('.verse .header').text('Verse');
        }
        if(selValue === 'KJV'){
            $('.which-bible').text('King James Version (KJV)');
        }else if(selValue === 'ESV'){
            $('.which-bible').text('English Standard Version (ESV)');
        }else if(selValue === 'HIND'){
            $('.which-bible').text('Hindi Holy Bible (HIND)');
        }
    });
    //show selected book chapter numbers
    $('.book-list ul').on('click', 'li', function(e) {
        e.preventDefault();
        let id = $(this).attr('id');
        book = id.toString().substring(1);

        $('.book-list ul li').removeClass('active-book');
        $('.book-list ul #' + id).addClass("active-book");

        BCV.innerHTML = "";
        scripture.innerHTML = "";
        verseNumbers.innerHTML = "";
        chapterNumbers.innerHTML = "";
        query 
        knex('verses').distinct('chapter').where('book_id', book)
            .then((rows) => {
                for (row of rows) {
                    chapterNumbers.innerHTML += "<span id='c" + row.chapter + "'>" + isNep(row.chapter) + "</span>";
                }
            });
    });
    //show selected chapter verse numbers
    $('.chapter-numbers').on('click', 'span', function(e) {
        e.preventDefault();
        let id = $(this).attr('id');
        chapter = id.toString().substring(1);

        $('.chapter-numbers span').removeClass('active-c-v');
        $('.chapter-numbers #' + id).addClass("active-c-v");

        BCV.innerHTML = "";
        scripture.innerHTML = "";
        verseNumbers.innerHTML = "";
        query 
        knex('verses').select('verse').where({ 'book_id': book, 'chapter': chapter })
            .then((rows) => {
                for (row of rows) {
                    verseNumbers.innerHTML += "<span id='ve" + row.verse + "'>" + isNep(row.verse) + "</span>";
                }
            });
        knex.select('book_name', 'chapter', 'verse', 'scripture').from('verses').innerJoin('books','verses.book_id','books.book_id').where({ 'verses.book_id': book, 'chapter': chapter })
            .then((rows) => {
                let tVerse=0;
                for (row of rows) {
                    scriptures.innerHTML += "<p id='v" + row.verse + "'><sup>" + isNep(row.verse) + "</sup> <span class='intend-txt'>" + row.scripture + "</span></p>";
                    tVerse = row.verse;
                }
                $('.scripture p').css('fontSize',scriptureFont);
                $('.scripture sup').css('fontSize',supFont);
                BCV.innerHTML = row.book_name + " " + isNep(row.chapter) + ": "+isNep(1)+" - " + isNep(tVerse);
            });
    });
    //show selected book scriptures
    $('.verse-numbers').on('click', 'span', function(e) {
        e.preventDefault();
        let id = $(this).attr('id');
        verse = id.toString().substring(2);

        $('.verse-numbers span').removeClass('active-c-v');
        $('.verse-numbers #' + id).addClass("active-c-v");
        let vID = 'v' + verse.toString();
        //query 
        var thisVerse = document.getElementById(vID).offsetTop;
        var divTop = document.getElementById('scriptures').offsetTop;
        //scroll to selected verse
        $('html,body, .scripture').animate({
            scrollTop: thisVerse - divTop
        }, 400);
    });

    //set user defaults
    $('.set-default').on('click', function(){
        const curVersion = $("select.bible-version").children("option:selected").val();
        setDefault(curVersion,scriptureFont,supFont);
        $('.notification').css('display','flex');
        $('#n-text').text("'"+curVersion+"' Set as Default");
        setTimeout(function(){
            $('.notification').css('display','none');
        }, 3000)
    });
    //notification
    $('#n-close').on('click', function(){
        $('.notification').css('display','none');
    });
});