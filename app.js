var posts = [],
    comments = [],
    users = [],
    likes = [];

jQuery("#btn_addPost").hide();
if (localStorage.a_posts && localStorage.a_comments && localStorage.a_users && localStorage.a_likes) {
    jQuery("#btn_addPost").show();
    jQuery("#getDataBtn").hide();
    posts = JSON.parse(localStorage.a_posts);
    comments = JSON.parse(localStorage.a_comments);
    users = JSON.parse(localStorage.a_users);
    likes = JSON.parse(localStorage.a_likes);
    displayPosts(20);
}

function getPosts() {
    var promise = new Promise(function(resolve, reject) {
        var http = new XMLHttpRequest();

        http.onreadystatechange = function() {
            if(http.readyState==4 && http.status==200) {
                resolve(http.responseText);
            }
        };
        http.open('GET', 'https://jsonplaceholder.typicode.com/posts');
        http.send();
    });
    return promise;
}

function getComments() {
    var promise = new Promise(function(resolve, reject) {
        var http = new XMLHttpRequest();

        http.onreadystatechange = function() {
            if(http.readyState==4 && http.status==200) {
                resolve(http.responseText);
            }
        };
        http.open('GET', 'https://jsonplaceholder.typicode.com/comments');
        http.send();
    });
    return promise;
}

function getUsers() {
    var promise = new Promise(function(resolve, reject) {
        var http = new XMLHttpRequest();

        http.onreadystatechange = function() {
            if(http.readyState==4 && http.status==200) {
                resolve(http.responseText);
            }
        };
        http.open('GET', 'https://jsonplaceholder.typicode.com/users');
        http.send();
    });
    return promise;
}
jQuery("#getDataBtn").click(function() {

    Promise.all([getPosts(), getComments(), getUsers()]).then(function(data) {
        jQuery("#btn_addPost").show();
        posts = JSON.parse(data[0]);
        comments = JSON.parse(data[1]);
        users = JSON.parse(data[2]);
        localStorage.a_posts = JSON.stringify(posts);
        localStorage.a_comments = JSON.stringify(comments);
        localStorage.a_users = JSON.stringify(users);
        localStorage.a_likes = JSON.stringify(likes);
        jQuery("#getDataBtn").hide();
        displayPosts(20);
    },
    function(err) {
        console.log('Error = '+err);
    });
});


function findElements(arr, propName, propValue) {
    var results = [];
    for (var i = 0; i < arr.length; i++) {
        if (arr[i][propName] === propValue) {
            results.push(arr[i]);
        }
    }
    return results;
}

function displayPosts(num) {
    $("#table").find("tr").remove();
    var leng = posts.length;
    var rowNum = leng;
    if (num == 10 && leng >= 10) {
        rowNum = 10;
    }
    if (num == 20 && leng >= 20) {
        rowNum = 20;
    }
    if (num == 50 && leng >= 50) {
        rowNum = 50;
    }
    if (num == 100 && leng >= 100) {
        rowNum = 100;
    }
    for (var i = 0; i < rowNum; i++) {
        var username = findElements(users, "id", posts[i].userId)[0].username;

        var post = `
                        <tr id="tr_${i}">
                            <td>
                                <p style="font-weight: bold">${username}</p>
                                <p style="font-weight: bold; font-size: 25px;">${posts[i].title}</p>
                                <p>${posts[i].body}</p><br />
                                <div>
                    `;
        var likeArray = findElements(likes, "postId", posts[i].id);
        var ifLiked = likeArray.length === 0? false: true;
        post += ifLiked? `<input type="button" value="Liked" style="color: pink" id="btn_like_${i}" />`
                        :`<input type="button" value="Like" id="btn_like_${i}" />`;
                                    
        post += `
                                    <input type="button" value="Comment" id="btn_comments_${i}" />
                                    <input type="button" value="Edit" id="btn_edit_${i}" />
                                    <input type="button" value="Delete" id="btn_delete_${i}" />
                                </div>
                            </td>
                        </tr>
                    `;
        document.getElementById('table').insertAdjacentHTML('beforeend', post);
    }
}


jQuery(document).on('click', 'input[id^="btn_comments_"]', function() {
    var id = jQuery(this).attr('id').slice(13),
        tr_id = jQuery(this).attr('id').replace('btn_comments_', 'tr_'),
        tr_id_comments = tr_id + "_comments";
    if(jQuery('#' + tr_id_comments).length != 0 ) {
        jQuery('#' + tr_id_comments).remove();
    }
    else {
        var commentsArray = findElements(comments, "postId", posts[id].id);
        var commentsHTML = `<tr id="${tr_id}_comments">
                                <td>
                                    <p>Comments</p>`;
        for(var i  = 0; i < commentsArray.length; i++) {
            commentsHTML += `<p>${(i+1)}. ${commentsArray[i].body}</p>`
        }
        commentsHTML += `           <input type="button" value="Add Comment" id="btn_addComment_${id}" />
                                </td>
                            </tr>`;
        jQuery('#' + tr_id).after(commentsHTML);
    }
});

jQuery(document).on('click', 'input[id^="btn_delete_"]', function() {
    var id = jQuery(this).attr('id').slice(11),
        tr_id = jQuery(this).attr('id').replace('btn_delete_', 'tr_'),
        tr_id_comments = tr_id + "_comments";
    comments = JSON.parse(localStorage.a_comments);
    likes = JSON.parse(localStorage.a_likes);
    comments = comments.filter(function(comment){
        return comment.postId !== posts[id].id;
    });
    likes = likes.filter(function(like){
        return like.postId !== posts[id].id;
    });
    posts.splice(id, 1);
    displayPosts(20);
    localStorage.a_posts = JSON.stringify(posts);
    localStorage.a_comments = JSON.stringify(comments);
    localStorage.a_likes = JSON.stringify(likes);
});


jQuery(document).on('click', 'input[id^="btn_addComment_"]', function() {
    var id = jQuery(this).attr('id').slice(15);
        tr_id = jQuery(this).attr('id').replace('btn_addComment_', 'tr_'),
        tr_id_comments = tr_id + "_comments",
        tr_id_addComment = tr_id + "_addComment";
    if(jQuery('#' + tr_id_addComment).length != 0 ) {
        jQuery('#' + tr_id_addComment).remove();
    }
    else {
        var addCommentHTML = `
                            <tr id="${tr_id_addComment}">
                                <td>
                                    <input type="text" placeholder="Name" id="comment_name_${id}" /></br>
                                    <input type="text" placeholder="Email" id="comment_email_${id}" /></br>
                                    <textarea rows="3" placeholder="Body" type="text" id="comment_body_${id}" />
                                    <div>
                                        <input type="button" value="Save" id="comment_save_btn_${id}" />
                                    </div>
                                </td>
                            </tr>
                        `;
        jQuery('#' + tr_id_comments).after(addCommentHTML);
    }
});

function getLastCommentId() {
    var result = 0;
    for (var i = 0; i < comments.length; i++) {
        if (comments[i].id > result) {
            result = comments[i].id;
        }
    }
    return result;
};

function getLastPostId() {
    var result = 0;
    for (var i = 0; i < posts.length; i++) {
        if (posts[i].id > result) {
            result = posts[i].id;
        }
    }
    return result;
};

function addWarningMsg(id) {
    var warning = id + '_warning';
    if(!document.getElementById(warning) && !document.getElementById(id).value) {
        document.getElementById(id).insertAdjacentHTML('afterend', `<span style="color:red" id="${warning}">Please enter!</span>`);
    }
    console.log(document.getElementById(id).value + " " + document.getElementById(warning));
    if(document.getElementById(id).value && document.getElementById(warning)) {
        document.getElementById(warning).remove();
    }
}

jQuery(document).on('click', 'input[id^="comment_save_btn_"]', function() {
    var id = jQuery(this).attr('id').slice(17);
        tr_id = jQuery(this).attr('id').replace('comment_save_btn_', 'tr_'),
        tr_id_comments = tr_id + "_comments",
        tr_id_addComment = tr_id + "_addComment";
    var postId = posts[id].id,
        commentId = getLastCommentId() + 1,
        name = jQuery('#comment_name_' + id)[0].value,
        email = jQuery('#comment_email_' + id)[0].value,
        body = jQuery('#comment_body_' + id)[0].value;
    if (jQuery('#comment_name_' + id)[0].value && jQuery('#comment_email_' + id)[0].value &&
        jQuery('#comment_body_' + id)[0].value) {
            var newComment = {
                "postId": postId,
                "id": commentId,
                "name": name,
                "email": email,
                "body": body
            };
            comments = JSON.parse(localStorage.a_comments);
            comments.push(newComment);
            localStorage.a_comments = JSON.stringify(comments);
            displayPosts(20);
            jQuery('#btn_comments_' + id).click();
        }
        else {
            addWarningMsg('comment_name_' + id);
            addWarningMsg('comment_email_' + id);
            addWarningMsg('comment_body_' + id);
        };
    
});

function appendMorePosts(id, num) {
    var leng = posts.length - id;
    var rowNum = leng;
    if (num == 10 && leng >= 10) {
        rowNum = 10;
    }
    if (num == 20 && leng >= 20) {
        rowNum = 20;
    }
    if (num == 50 && leng >= 50) {
        rowNum = 50;
    }
    if (num == 100 && leng >= 100) {
        rowNum = 100;
    }
    for (var i = id; i < rowNum + id; i++) {
        var username = findElements(users, "id", posts[i].userId)[0].username;
        var post = `
                        <tr id="tr_${i}">
                            <td>
                                <p style="font-weight: bold">${username}</p>
                                <p style="font-weight: bold; font-size: 25px;">${posts[i].title}</p>
                                <p>${posts[i].body}</p><br />
                                <div>
                    `;
        var likeArray = findElements(likes, "postId", posts[i].id);
        var ifLiked = likeArray.length === 0? false: true;
        post += ifLiked? `<input type="button" value="Liked" style="color: pink" id="btn_like_${i}" />`
                        :`<input type="button" value="Like" id="btn_like_${i}" />`;
                                    
        post += `
                                    <input type="button" value="Comment" id="btn_comments_${i}" />
                                    <input type="button" value="Edit" id="btn_edit_${i}" />
                                    <input type="button" value="Delete" id="btn_delete_${i}" />
                                </div>
                            </td>
                        </tr>
                `;        
        document.getElementsByTagName('tr')[document.getElementsByTagName('tr').length - 1].insertAdjacentHTML('afterend', post);
    }
}

var scrollFn = function() {
    if($(window).scrollTop() + $(window).height() == $(document).height()) {
        var id = parseInt(jQuery("tr:last").attr('id').slice(3));
        if (id + 1 == posts.length) {
            window.removeEventListener('scroll', scrollFn);
            jQuery("table").after("No more records");
        }
        else {
            appendMorePosts(id + 1, 20);
        }
    }
 };

 window.addEventListener('scroll', scrollFn);

 jQuery(document).on('click', 'input[id^="btn_like_"]', function() {
    var id = jQuery(this).attr('id').slice(9),
        btn_like_id = "btn_like_" + id;
    likes = JSON.parse(localStorage.a_likes);
    var ifLiked = false;
    for (var i = 0; i < likes.length; i++) {
        if (likes[i].postId === posts[id].id) {
            ifLiked = true;
            likes.splice(i, 1);
            break;
        }
    }
    if (!ifLiked) {
        var l = {
            "postId": posts[i].id
        };
        likes.push(l);
    };
    jQuery(this)[0].outerHTML = ifLiked? `<input type="button" value="Like" id="${btn_like_id}" />`: `<input type="button" value="Liked" style="color: pink" id="${btn_like_id}" />`;
    localStorage.a_likes = JSON.stringify(likes);
    
 });

 jQuery(document).on('click', 'input[id^="btn_edit_"]', function() {
    var id = jQuery(this).attr('id').slice(9);
        tr_id = jQuery(this).attr('id').replace('btn_edit_', 'tr_'),
        tr_id_edit = tr_id + "_edit";
    posts = JSON.parse(localStorage.a_posts);
    var postTitle = posts[id].title,
        postBody = posts[id].body;
    console.log(postTitle + " " + postBody);
    if(jQuery('#' + tr_id_edit).length != 0 ) {
        jQuery('#' + tr_id_edit).remove();
    }
    else {
        jQuery('#' + tr_id).after(`
            <tr id="${tr_id_edit}">
                <td>
                    <input id="title_${id}" value="${postTitle}" /><br/>
                    <textarea rows="3" style="width: 500px" id="body_${id}">${postBody}</textarea>
                    <div>
                        <input type="button" value="Save" id="btn_save_${id}" />
                    </div>
                </td>
            </tr>
        `);
    }
});

jQuery(document).on('click', 'input[id^="btn_save_"]', function() {
    var id = jQuery(this).attr('id').slice(9);
    tr_id = jQuery(this).attr('id').replace('btn_save_', 'tr_');
    var post = posts[id];
    if (jQuery("#title_" + id)[0].value) {
        post.title = jQuery("#title_" + id)[0].value;
    }
    if (jQuery("#body_" + id)[0].value) {
        post.body = jQuery("#body_" + id)[0].value;
    }
    
    displayPosts(20);
    localStorage.a_posts = JSON.stringify(posts);
});

jQuery(document).on('click', '#btn_addPost', function() {
    if(jQuery('#form').length != 0 ) {
        jQuery('#form').remove();
    }
    else {
        jQuery('#table').before(`
            <div id="form">
                <input type="text" placeholder="UserID" id="userId" /><br />
                <input type="text" placeholder="Title" id="title" /><br />
                <input type="text" placeholder="Body" id="body" /><br />
                <div>
                    <input type="button" value="Submit" id="btn" />
                </div>
                <br />
            </div>
        `);
    }
});

jQuery(document).on('click', '#btn', function() {
    if (document.getElementById('userId').value && document.getElementById('title').value 
        && document.getElementById('body').value) {

        if (findElements(users, "id", parseInt(document.getElementById('userId').value)).length == 0) {
            document.getElementById('userId').insertAdjacentHTML('afterend', `<span style="color:red" id="valid_warning">Please enter a valid user ID!</span>`);
        }else {
            var lastPostId = getLastPostId();
            var newPost = {
                'userId': parseInt(document.getElementById('userId').value),
                'id': lastPostId + 1,
                'title': document.getElementById('title').value,
                'body': document.getElementById('body').value
            };
            posts.push(newPost);
            localStorage.a_posts = JSON.stringify(posts);
            displayPosts(20);
            if(document.getElementById('userId_warning')) {
                document.getElementById('userId_warning').remove();
            }
            if(document.getElementById('title_warning')) {
                document.getElementById('title_warning').remove();
            }
            if(document.getElementById('body_warning')) {
                document.getElementById('body_warning').remove();
            }
            if(document.getElementById('valid_warning')) {
                document.getElementById('valid_warning').remove();
            }
        }
    }
    else {
        if (document.getElementById('userId').value && findElements(users, "id", parseInt(document.getElementById('userId').value)).length == 0 && !document.getElementById("valid_warning")) {
            document.getElementById('userId').insertAdjacentHTML('afterend', `<span style="color:red" id="valid_warning">Please enter a valid user ID!</span>`);
        }
        if(findElements(users, "id", parseInt(document.getElementById('userId').value)).length !== 0 && document.getElementById("valid_warning")) {
            document.getElementById("valid_warning").remove();
        }
        addWarningMsg('userId');
        addWarningMsg('title');
        addWarningMsg('body');
    }
});