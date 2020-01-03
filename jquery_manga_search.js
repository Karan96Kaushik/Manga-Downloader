
    $(document).ready(function () {
        $('[data-toggle="tooltip"]').tooltip();
        $('.toggle').click(function () {
            // Switches the Icon
            $(this).children('i').toggleClass('fa-pencil');
            // Switches the forms
            $('.form').animate({
                height          : "toggle",
                'padding-top'   : 'toggle',
                'padding-bottom': 'toggle',
                opacity         : "toggle"
            }, "slow");
        });

        $.ajaxSetup({ cache: false });

        function search() {
            if($('#searchComic').val().trim()) {
                $.getJSON('/live_search/' + encodeURIComponent($('#searchComic').val()), function(data) {
                    $('#result').html('');
                    for(let key = 0; key < data.length; key++) {
                        if(key < 3) {
                            let value = data[key];
                            $('#result').append(
                                    `<li class="list-group-item link-class">
                                        <a class="search-item" href="/single/${value.id}/${value.nameShort}" style="color:#898989;">
                                            <table>
                                                <tr>
                                                    <td style="width:1%;">
                                                        <img src="/uploads/images/comics${value.image}" style="width: 50px;max-width: 50px;" class="img-thumbnail" />
                                                    </td>
                                                    <td style="padding:5px;" >
                                                        <h4 style="color:#337ab7;">${value.name}</h4>
                                                        ${
                                                            value.malId > 0 ? `<b>${value.scored}</b> by <b>${value.scoredBy}</b> users <i style="font-size:0.7em">myanimelist</i><br>` : ''
                                                        }
                                                        <b>${value.currentChapter}</b>
                                                    </td>
                                                </tr>
                                            </table>
                                        </a>
                                    </li>`
                                );
                        }
                    }
                    if(data.length == 4) {
                        $('#result').append(`<li class="list-group-item link-class" ><a class="search-item" onclick="$('#formSearchSubmit').click();"><h4><center>-- See more results --</center></h4></a></li>`);
                    }
                    $('#preload_livesearch').hide();
                });
            }
        }
        let timeoutSearch;
        $('#searchComic').keyup(function(){
            $('#result').html('');
            $('#result').show();
            if(timeoutSearch) clearTimeout(timeoutSearch);
            if($('#searchComic').val().trim()) {
                $('#preload_livesearch').css('display', 'block');
                timeoutSearch = setTimeout(search, 1000);
            } else {
                $('#preload_livesearch').hide();
            }
        });
        var clicky;
        $(document).mousedown(function(e) {
            clicky = $(e.target);
        });
        $(document).mouseup(function(e) {
            clicky = null;
        });

        $('#searchComic').blur(function(e) {
             if(!$(clicky).hasClass('search-item') && !$(clicky).closest('.search-item').length){
                $('#result').hide();
             }
        });

        $('#formSearch input[type="submit"]').click(function (event) {
            if($('#searchComic').val().trim()) {
                location.href = 'http://mangaowl.com/search/' + encodeURIComponent($('#searchComic').val()) + '/1';
            }
        });
    });
