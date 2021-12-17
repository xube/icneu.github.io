$(document).ready(function ($) {
    
    
    ////////////////////////////////////////////////////// FA4 LEGACY  ICONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    ///CLICK NEW ICON: SUBSTITUTE CLASS
    $("#sidepanel").on("click", "#lc-fontawesome-icons i.fa", function (event) {
        event.preventDefault();
        var theSection=$(this).closest("section[selector]");
        
        //get chosen icon's class name
        var chosen_icon_class=$(this).removeClass("fa").attr("class");
        $(this).addClass("fa"); //restore it
        //alert(chosen_icon_class);
                 
        //var selector=$(this).closest("section[selector]").attr("selector");
        var current_classes= theSection.find("input[attribute-name=class]").val();
        var class_to_eliminate= (current_classes.match (/(^|\s)fa-[a-z|-]+/g) || []).join(' ');
        var classes_new=current_classes.replace(class_to_eliminate,'')+" "+chosen_icon_class;
        //alert(classes_new);

        theSection.find('input[attribute-name=class]').val(classes_new).change();
    });
    
    
    // USER SEARCH FOR ICONS
    $('section[item-type=icon] input[name="icon_search"]').on('keyup',function() {
        var theSection=$(this).closest("section[selector]");
        var search = $(this).val();
        if (search==="") theSection.find("#lc-fontawesome-icons h2,#lc-fontawesome-icons ul").show(); else theSection.find("#lc-fontawesome-icons h2,#lc-fontawesome-icons ul").slideUp();
        theSection.find('#lc-fontawesome-icons .fontawesome-icon-list i.fa').each(function(k,v) {
            if($(v).attr('class').indexOf(search.toLowerCase()) < 0) {
                $(v).parent().parent().hide();
            } else {
                $(v).parent().parent().show();
            }
        });
    });
    
	
    ////////////////////////////////////////////////////// SVG INLINE  ICONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
	//ON CHANGE SELECT FOR ICON SET, LOAD NEW ICON SET
	$("body").on("change", "#sidepanel section[item-type=svg-icon] *[name=iconset]",function(){ 
		$("#lc-svg-icons").load("?lc_action=load_"+$(this).val()+"_icons", function() {});
		if ($("#sidepanel section[item-type=svg-icon] *[name=iconset]").val()=="bs" || $("#sidepanel section[item-type=svg-icon] *[name=iconset]").val()=="mdi") $("#svg-icon-search-tool").slideDown(); else $("#svg-icon-search-tool").slideUp();
        $('section[item-type=icon] input[name="icon_search"]').val(); //reset search field
    });
     
	
    ///CLICK NEW ICON: SUBSTITUTE HTML CONTENT
    $("#sidepanel").on("click", "#lc-svg-icons svg", function (event) {
        event.preventDefault();
        var theSection=$(this).closest("section[selector]");
        var selector=theSection.attr("selector");
		var chosen_icon_outerhtml = $(this)[0].outerHTML;
        //save width and height of old element and the classes
		var theWidth= doc.querySelector(selector).getAttribute("width");
        var theHeight= doc.querySelector(selector).getAttribute("height");
        var theClasses = doc.querySelector(selector).className.baseVal;
		//apply the new chosen icon
		setPageHTMLOuter(selector, chosen_icon_outerhtml);
		//restore width, height attributes and classes
		if (theWidth) doc.querySelector(selector).setAttribute("width",theWidth); else doc.querySelector(selector).removeAttribute("width");
		if (theHeight) doc.querySelector(selector).setAttribute("height",theHeight); else doc.querySelector(selector).removeAttribute("height");
		if (theClasses) doc.querySelector(selector).className.baseVal=theClasses; else doc.querySelector(selector).removeAttribute('class'); 
        //if($("#sidepanel section[item-type=svg-icon] *[name=iconset]").val()!='bs')	
        doc.querySelector(selector).setAttribute("lc-helper","svg-icon");
		doc.querySelector(selector).setAttribute("fill","currentColor"); //useful for enabling color classes to work
		updatePreviewSectorial(selector);
    });
	
    //USER DRAGS SIZE SLIDER
    $('#sidepanel').on('input', 'section[item-type=svg-icon] input[name=size]', function (event) {    
        event.preventDefault();
		var theSection=$(this).closest("section[selector]");
		var selector=$(this).closest("section[selector]").attr("selector");
		var unit=theSection.find("select[name=unit]").val();//alert(unit);
		if(unit==="rws") {
			//resize using rws- utility classes 
			theSection.find(".size-feedback").text(".rws-"+$(this).val());
			doc.querySelector(selector).removeAttribute("width");
			doc.querySelector(selector).removeAttribute("height");
			for (i = 0; i < 50; i++) doc.querySelector(selector).classList.remove("rws-"+i);	
			doc.querySelector(selector).classList.add("rws-"+$(this).val());
			theSection.find(".common-form-fields input[attribute-name=class]").val(doc.querySelector(selector).getAttribute("class"));
			
		} else {
			//resize using an unit value, eg "em"
			var icon_size=$(this).val()+unit;
			theSection.find(".size-feedback").text(icon_size);
			doc.querySelector(selector).setAttribute("width",icon_size);
			doc.querySelector(selector).setAttribute("height",icon_size);
			for (i = 0; i < 50; i++) doc.querySelector(selector).classList.remove("rws-"+i);
			theSection.find(".common-form-fields input[attribute-name=class]").val(doc.querySelector(selector).getAttribute("class"));
		}
		
		updatePreviewSectorial(selector);
	});
	
    // USER SEARCH FOR ICONS
    $('section[item-type=svg-icon] input[name="icon_search"]').on('keyup',function() {
        var theSection=$(this).closest("section[selector]");
        var search = $(this).val();
        if (search==="") theSection.find("#lc-svg-icons svg").show();  
        theSection.find('#lc-svg-icons svg').each(function(k,v) {
            if($(v).attr('class').indexOf(search.toLowerCase()) < 0)  $(v).hide(); else $(v).show();
        });
    });
    
	
	
    /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////// 
    //////////////////////////////////////////////////////  IMAGES ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    ////////////////////////////// IMAGE   ////////////////////////////////
    //upon src input change, trigger change in document | attribute values editing
    $("body").on("change", "#sidepanel section[item-type=image] *[attribute-name=src]",function(){
        $("#sidepanel section[item-type=image] .preview-image").css("background-image","url("+$(this).val()+")");
    });
     
    //////////////////////////////////////   BACKGROUND ////////////////////////////////////////////////////////
    //upon src input change, substitute in inline css the image url //////////////////////////
	$('#sidepanel').on('change', 'section[item-type=background] input[name=background-image]', function (event) {    
        event.preventDefault();
        if ($(this).val()==='') {$(this).val("#");}
        var old_url=$("#sidepanel section[item-type=background] input[name=background-image]").attr("data-old-url"); 
        var old_css=$("#sidepanel section[item-type=background] textarea[attribute-name=style]").val();
        if (old_css=="") old_css='background:url(#)  center / cover no-repeat;';
        var new_css=old_css.replace(old_url, $(this).val());
        $("#sidepanel section[item-type=background] textarea[attribute-name=style]").val((new_css)).change();
        
        $("#sidepanel section[item-type=background] .preview-image").css("background-image","url("+$(this).val()+")");
        
        $(this).attr("data-old-url",$(this).val());
    });//end function
    
    //LINK  TARGET URL CHANGE ////

	//INPUT changes: trigger change in document 
	$("body").on("change", "#sidepanel section .link-target-url", function() {
		console.log("link-target-url values editing");
		var selector = $(this).closest("section").attr("selector");
		var superparent_selector = CSSelector(doc.querySelector(selector).parentNode.parentNode);

		//ADD IDENTIFIER CLASS
		var random_identifier_class_name="lc-temp-identifier-"+lc_randomString();
		doc.querySelector(selector).classList.add(random_identifier_class_name);
		
		if ($(this).val()==""){
			//CASE URL VALUE IS EMPTY: IF PARENT ELEMENT IS AN ANCHOR, UNWRAP IMAGE
			if(doc.querySelector(selector).parentNode.tagName==="A") {
				console.log("Unwrap item");
				image_html = doc.querySelector(selector).outerHTML;
				doc.querySelector(selector).parentNode.outerHTML = image_html; 
			}
		} else {
			//CASE URL VALUE IS NOT EMPTY: IF PARENT ELEMENT IS NOT AN ANCHOR, WRAP IMAGE WITH LINK, ELSE UPDATE HREF ATTRIBUTE
			if(doc.querySelector(selector).parentNode.tagName!=="A") {
				console.log("Wrap item in a");
				image_html = doc.querySelector(selector).outerHTML; 
				doc.querySelector(selector).outerHTML = "<a href='"+$(this).val()+"'> \n" + image_html + "\n</a>";
			}  else 
			doc.querySelector(selector).parentNode.setAttribute("href",  $(this).val());
		}

		//UPDATE PANEL SELECTOR SO WE WORK ON THE REAL NEW ICON / IMAGE IN THE NEXT EDITING MOMENT
		var new_selector = CSSelector(doc.querySelector("."+random_identifier_class_name));
		$(this).closest("section").attr("selector", new_selector);

		//REMOVE THE IDENTIFIER CLASS 
		doc.querySelector(new_selector).classList.remove(random_identifier_class_name);

		//UPDATE THE PREVIEW
		updatePreviewSectorial(superparent_selector);
		
    });
    
    //////////////////////////////////////////////////// WPADMIN IMAGES //////////////////////////////////////////////////////////////////////////////
     
    ///CLICK WPADMIN TAB
    $("#sidepanel").on("click", ".lc-show-wpadmin-search", function (event) {
        if($(this).hasClass("highlight-button")) return; ///proceed only when opening tab
        current_section=$(this).closest("section");
        current_section.find(".wpadmin-image-format-chooser .preview").click(); 
    });
    
    ///CLICK   WPADMIN & SHOW SEARCH INTERFACE
    $("#sidepanel").on("click", ".wpadmin-image-format-chooser .preview", function (event) {
        event.preventDefault();
        current_section=$(this).closest("section");
        current_section.find(".wpadmin-loading").show();
        current_section.find(".wpadmin-image-format-chooser").hide();
        var the_iframe=current_section.find('.lc-wpadmin-imagesearch-wrap iframe');
        //if(the_iframe.attr("src")=="")
        the_iframe.hide().attr("src",lc_editor_media_upload_url);
        setTimeout(function(){ the_iframe.fadeIn(100); }, 1000);
    });
    
    ///CLICK A FORMAT AND APPLY IMAGE
    $("#sidepanel").on("click", ".wpadmin-image-format-chooser a", function (event) {
        event.preventDefault();
        current_section = $(this).closest("section"); 
        
        $.post(
            lc_editor_saving_url, {
                'action': 'lc_get_img_tag', 
                'post_id': $(this).attr("attachment-id"),
                'format': $(this).attr("format"),
        },
            function (response) {
                try { 
                    result = JSON.parse(response);
                    current_section.find(" *[attribute-name='src'], *[name='background-image']").val(result.src).change();
                    current_section.find(" *[attribute-name='width']").val(result?.width).change();
                    current_section.find(" *[attribute-name='height']").val(result?.height).change();
                    current_section.find(" *[attribute-name='srcset']").val(result?.srcset).change();  
                    current_section.find(" *[attribute-name='sizes']").val(result?.sizes).change(); 
                    current_section.find(" *[attribute-name='alt']").val(result?.alt).change();
                } catch(e) {
                    alert("Image data fetch error: "+e);
                }
            }
        );

    
       
    });
 
 
 
    //////////////////////////////////////////////////// UNSPLASH //////////////////////////////////////////////////////////////////////////////
    
	//IMAGES: UNSPLASH  init Search Pagination when focusing search input //////////////////////////
    $('#sidepanel').on('focus', 'input[name="unsplash-search-by-keyword"]', function () {
        //INIT PAGINATION
        $(this).attr("data-page","1");
        console.log("init pagination");
    });
    
    //IMAGES: UNSPLASH  Search by Keyword //////////////////////////
	$('#sidepanel').on('change', 'input[name="unsplash-search-by-keyword"]', function (event) {
		event.preventDefault();
        var current_page=parseInt($(this).attr("data-page"),10);
        var current_section=$(this).closest("section");
        
		current_section.find(".lc-unsplash-search-results").html("<div class='donut'></div>"); //ADD SPINNER
        var orientation=current_section.find("[name=unsplash-search-orientation]").val();
        var jqxhr = $.getJSON("https://api.unsplash.com/search/photos/?client_id=241722b04b93fb65e1514ad48c3e916f5399e7766e5fa0dba784e008b9866216&orientation="+orientation+"&query="+$(this).val()+"&page="+current_page , function(a) {
            //console.log(a.results);
            var headingText='<small><p>'+a.total+' results.  Page <b>'+current_page+' of '+a.total_pages+'</b></p>  </small>';
            html_li="";
            $.each(a.results, function( index,el ) {
                html_li+=' <li>  <img class="" src="' +el.urls.thumb+'" alt="" data-src-small="' +el.urls.small+'" data-src-regular="' +el.urls.regular+'" data-author-name="' +el.user.name+'"  >  </li>   ';
            });
            //check if we have to add pagination buttons
            if ( current_page>1 )  prevButton="<button class='lc-unsplash-pagination-button lc-pagination-button  lcb' data-page='"+(current_page-1)+"' > Previous<br>Page</button>"; else   prevButton="";    
            if (a.total_pages>current_page)  nextButton="<button class='lc-unsplash-pagination-button lc-pagination-button  lcb' data-page='"+(1+current_page)+"' >  Next <br>Page </button>"; else   nextButton="";
            
            current_section.find(".lc-unsplash-search-results").html(headingText+'<ul>' + html_li + '</ul>'+ prevButton+nextButton); 
                
        }); //end loaded json ok
        
        jqxhr.fail(function() {
            swal("Network error. Could not connect to UnSplash. Try later.");
            current_section.find(".lc-unsplash-search-results").html("");
        });
    }); //end  func

    function setUnsplashSrcset(current_section,img_url){
        $.post(
            lc_editor_saving_url, {
            'action': 'lc_ajax_unsplash_srcset',
            'image_url': img_url,
        },
            function (response) {
                try {
                    result = JSON.parse(response);
                    current_section.find(" *[attribute-name='width']").val(result?.width).change();
                    current_section.find(" *[attribute-name='height']").val(result?.height).change();
                    current_section.find(" *[attribute-name='srcset']").val(result?.srcset).change();
                    current_section.find(" *[attribute-name='sizes']").val(result?.sizes).change();

                } catch (e) {
                    alert("Image data fetch error: " + e);
                }
            }
        );
    }
    ///CLICK UNSPLASH RESULT - IMAGES <img> VERSION
    $("#sidepanel").on("click", " .lc-unsplash-search-results img", function (event) {
        event.preventDefault();
        var current_section=$(this).closest("section");
        var img_url=$(this).attr("data-src-regular");
        if ($("[name=unsplash-search-orientation]").val()=="landscape") img_url=img_url.replace("w=1080","w=1080&h=768").replace("fit=max","fit=crop"); //refine format  
        if ($("[name=unsplash-search-orientation]").val()=="squarish") img_url=img_url.replace("w=1080","w=1080&h=1080").replace("fit=max","fit=crop"); //refine format  
        //reset sizes and srcset fields
        current_section.find(" *[attribute-name='width'],  *[attribute-name='height'], *[attribute-name='srcset'], *[attribute-name='sizes'] ").val('').change();
        //set image src
        current_section.find(" input[attribute-name='src'], input[name='background-image']").val(img_url).change();
        current_section.find(" input[attribute-name='alt']").val("Photo by "+$(this).attr("data-author-name")).change();
        //srcset experiment
        setUnsplashSrcset(current_section, img_url);
 
    });
     
    
    //UNSPLASH PAGINATION buttons clicked
    $("#sidepanel").on("click", ".lc-unsplash-pagination-button", function (event) {
        event.preventDefault();
        var current_page=$(this).attr("data-page");
        var current_section=$(this).closest("section");
        current_section.find('input[name="unsplash-search-by-keyword"]').attr("data-page",current_page).change(); 
    });
       
    //IMAGES: UNSPLASH  change format   //////////////////////////
	$('#sidepanel').on('change', 'select[name="unsplash-search-orientation"]', function (event) {
        var current_section=$(this).closest("section");
        current_section.find('input[name="unsplash-search-by-keyword"]').change();
    });


    /////////////////////////////IMGIX FX ////////////////////////////////
	$('#sidepanel').on('change', ' select[name=imgix_fx]', function (event) {    
        event.preventDefault();
        var target_selector=$(this).attr('target');
        current_image_url=$(this).closest("section").find(target_selector).val();
        //alert(current_image_url);
        //get rid of all other elements in select
        $(this).find("option").each(function(index,element) { 
                  the_value= $(element).val(); //console.log(the_value);
                  current_image_url=current_image_url.replace(the_value,'').trim(); //kill the class if present
        });
        var current_selected_item=$(this).val();
        current_image_url=current_image_url+current_selected_item;
        $(this).closest("section").find(target_selector).val(current_image_url).change();
    });//end function
    
    
    //INPUT changes: on image url change, check if we show imgix fx
    $("body").on("change", "#sidepanel section[item-type=image] *[attribute-name=src], #sidepanel section[item-type=background] *[name=background-image]",function(){
        if ($(this).val().includes("unsplash.com")) {
            //if unsplash img update through ajax call
            $(".imgix-fx").show();
            current_section = $(this).closest("section");
            setUnsplashSrcset(current_section, $(this).val());
            return;
        }
        $(".imgix-fx").hide();
    });
    
    
    //////////////// OPENSVG ///////////////////////////
    /*
    //IMAGES: UNSPLASH  init Search Pagination when focusing search input //////////////////////////
    $('#sidepanel').on('focus', 'input[name="opensvg-search-by-keyword"]', function () {
        //INIT PAGINATION
        $(this).attr("data-page","1");
        console.log("init pagination");
    });
    
	//SVG Search by Keyword //////////////////////////
	jQuery('body').on('change', 'input[name="opensvg-search-by-keyword"]', function (event) {
        event.preventDefault();
        var current_page=parseInt($(this).attr("data-page"),10);
        var current_section=$(this).closest("section");
        
        current_section.find(".lc-opensvg-search-results").html("<div class='donut'></div>"); //ADD SPINNER

        var jqxhr = jQuery.getJSON("https://openclipart.org/search/json/?query="+jQuery(this).val()+"&amount=10&page="+current_page , function(a) {
            console.log(a);
            var headingText='<small><p>'+a.info.results+' images found.  Page <b>'+current_page+' of '+a.info.pages+'</b></p>  </small>';
            
            var html_li="";
            jQuery.each(a.payload, function( index,el ) {
               html_li+=' <li> <a href="#" data-url="'+el.svg.url+'"> <img class="" src="' +el.svg.png_thumb+'" alt=""></a></li>   ';
            });
            //check if we have to add pagination buttons
            if ( current_page>1 )  prevButton="<button class='lc-opensvg-pagination-button lc-pagination-button  lcb' data-page='"+(current_page-1)+"' >&laquo; Previous<br>Page</button>"; else   prevButton="";    
            if (a.info.pages>current_page)  nextButton="<button class='lc-opensvg-pagination-button lc-pagination-button  lcb' data-page='"+(1+current_page)+"' >Next <br>Page &raquo;</button>"; else   nextButton="";
            current_section.find(".lc-opensvg-search-results").html(headingText+'<ul>' + html_li + '</ul>'+ prevButton+nextButton); //POPULATE HTML FORM WITH OPTION        
            }); //end loaded json ok
        
        jqxhr.fail(function() { 		swal("Sorry, there is a problem connecting to the OpenSVG library."); 		});
        
        
	}); //end input change function
				
	//SVG Click Search Result
    jQuery("body").on("click", ".lc-opensvg-search-results a[data-url]", function (event) {
		event.preventDefault();
        var current_section=$(this).closest("section");
		var img_url=jQuery(this).attr("data-url");
		current_section.find(" input[attribute-name='src'], input[name='background-image']").val(img_url).change();
        //current_section.find(" input[attribute-name='alt']").val("Photo by "+$(this).attr("data-author-name")).change();
        
	});
   
        
    //PAGINATION buttons clicked
    $("#sidepanel").on("click", ".lc-opensvg-pagination-button", function (event) {
        event.preventDefault();
        var current_page=$(this).attr("data-page");
        var current_section=$(this).closest("section");
        current_section.find('input[name="opensvg-search-by-keyword"]').attr("data-page",current_page).change(); 
    });
          
   */
   ////////////////////////////////// VECTORIAL CLIPART ////////////////////////////////////////////////
 
    function lc_list_images(images_array,collection_name,final_cta){
        var html_li='<h4> '+collection_name+' </h4> <ul>'; 
        jQuery.each(images_array, function( index,el ) {
                 html_li+=' <li> <a href="#">   <img data-lazy="https://cdn.dopewp.com/media/svg/' +el +'"  alt=""></a></li>   ';
            });
        html_li = html_li + '</ul> <h5> '+final_cta+' </h5> '; 
        return html_li;
    
    }   
       
    ////////WHEN VECTORIAL PANEL IS OPENED, DRAW THE IMAGE PREVIEWS
    $("#sidepanel").on("click",".lc-show-vectorial-clipart:not(.highlight-button)", function (event) {
        event.preventDefault();
        
        //use this to generate arrays https://codepen.io/franciskim/pen/eNjrpR
        var undraw_images_array=["undraw-sample/undraw_wordpress_utxt.svg", "undraw-sample/undraw_connected_world_wuay.svg", "undraw-sample/undraw_world_9iqb.svg", "undraw-sample/undraw_video_influencer_9oyy.svg", "undraw-sample/undraw_video_streaming_yyld.svg", "undraw-sample/undraw_steps_ngvm.svg", "undraw-sample/undraw_experience_design_eq3j.svg", "undraw-sample/undraw_to_the_moon_v1mv.svg", "undraw-sample/undraw_heatmap_uyye.svg", "undraw-sample/undraw_Mobile_application_mr4r.svg"];
        var lukas_images_array=["lukaszadam/7.svg","lukaszadam/10.svg","lukaszadam/11.svg","lukaszadam/12.svg","lukaszadam/14.svg","lukaszadam/15.svg","lukaszadam/16.svg","lukaszadam/17.svg","lukaszadam/18.svg","lukaszadam/19.svg","lukaszadam/22.svg","lukaszadam/23.svg","lukaszadam/27.svg","lukaszadam/28.svg","lukaszadam/30.svg","lukaszadam/36.svg","lukaszadam/37.svg","lukaszadam/38.svg","lukaszadam/40.svg","lukaszadam/41.svg","lukaszadam/290.svg","lukaszadam/Asset 20.svg","lukaszadam/Asset 30.svg","lukaszadam/Asset 40.svg","lukaszadam/Asset 50.svg","lukaszadam/Asset 60.svg","lukaszadam/Asset 70.svg","lukaszadam/Asset 74.svg","lukaszadam/Asset 75.svg","lukaszadam/Asset 76.svg","lukaszadam/Asset 77.svg","lukaszadam/Asset 78.svg","lukaszadam/Asset 79.svg","lukaszadam/Asset 80 2.svg","lukaszadam/Asset 80 3.svg","lukaszadam/Asset 80.svg","lukaszadam/Asset 81.svg","lukaszadam/Asset 82.svg","lukaszadam/Asset 83.svg","lukaszadam/Asset 84.svg","lukaszadam/Asset 85.svg","lukaszadam/Asset 86.svg","lukaszadam/Asset 87.svg","lukaszadam/Asset 88.svg","lukaszadam/Asset 89.svg","lukaszadam/Asset 90 2.svg","lukaszadam/Asset 90 3.svg","lukaszadam/Asset 90.svg","lukaszadam/Asset 91.svg","lukaszadam/Asset 92.svg","lukaszadam/Asset 93.svg","lukaszadam/Asset 94.svg","lukaszadam/Asset 95.svg","lukaszadam/Asset 96.svg","lukaszadam/Asset 97.svg","lukaszadam/Asset 100.svg","lukaszadam/Asset 170.svg","lukaszadam/Asset 180.svg","lukaszadam/Asset 190 2.svg","lukaszadam/Asset 190.svg","lukaszadam/Asset 200 2.svg","lukaszadam/Asset 200.svg","lukaszadam/Asset 210 2.svg","lukaszadam/Asset 210.svg","lukaszadam/Asset 220 2.svg","lukaszadam/Asset 220.svg","lukaszadam/Asset 230.svg","lukaszadam/Asset 240.svg","lukaszadam/Asset 250.svg","lukaszadam/Asset 290.svg","lukaszadam/Asset 300.svg","lukaszadam/Asset 330.svg","lukaszadam/Asset 340.svg","lukaszadam/Asset 350.svg","lukaszadam/Asset 360.svg","lukaszadam/Asset 370.svg","lukaszadam/Asset 380.svg","lukaszadam/Asset 460.svg","lukaszadam/Asset 470.svg","lukaszadam/Asset 480.svg","lukaszadam/Asset 490.svg","lukaszadam/Asset 500.svg","lukaszadam/Asset 510.svg"];
        var isometric_images_array=["isometric/Analytics_SVG.svg","isometric/Chat_SVG.svg","isometric/City_SVG.svg","isometric/Coding_SVG.svg","isometric/Creative_process_SVG.svg","isometric/Cryptocurrency_SVG.svg","isometric/Data_analysis_SVG.svg","isometric/Data_chart_SVG.svg","isometric/Degital_marketing_SVG.svg","isometric/Delivery_app_SVG.svg","isometric/Farmacy_SVG.svg","isometric/Financial_insurance_SVG.svg","isometric/Investment_SVG.svg","isometric/Map_SVG.svg","isometric/Marketing_strategy_SVG.svg","isometric/Mobile_notification_SVG.svg","isometric/Online_banking_SVG.svg","isometric/Online_education_SVG.svg","isometric/Social_media_adv_SVG.svg","isometric/Startup_SVG.svg","isometric/Web_SVG.svg","isometric/Web_design_SVG.svg","isometric/Web_hosting_SVG.svg","isometric/app_development_SVG.svg","isometric/payment_completed_SVG.svg","isometric/workspace_SVG.svg","isometric/Business_SVG.svg","isometric/Money_SVG.svg","isometric/Online_shopping_SVG.svg","isometric/SEO_SVG.svg","isometric/Search_SVG.svg","isometric/Workspace_2_SVG.svg"];
        var drawkit_images_array=["drawkit/5c130301ae722d15669d267e_drawkit-charts-and-graphs.svg","drawkit/5c18815260ec1ad2acf8d06e_drawkit-nature-man-colour.svg","drawkit/5c130339d3261a0c43c32bf0_drawkit-developer-woman-colour.svg","drawkit/5c3429d690599d276db3112c_error-404-colour.svg","drawkit/5c37ce85e3cff74e120e427e_doctor-colour.svg","drawkit/5c3e7176c5034627e6b019f3_breakfast-colour.svg","drawkit/5c468f2a46b11943e664fb05_lifting-colour.svg","drawkit/5c47906dc604e536b612cc72_a-ok-colour.svg","drawkit/5c4910b2ef5a1c67f8771909_choices-colour.svg","drawkit/5c53a947a8cd6f0bcc8c1a24_holding-phone-colour.svg","drawkit/5c4fe6d7e6dca141c24389d8_handshake-colour.svg","drawkit/5c748ef25492e1745063350e_hiker-man-colour.svg","drawkit/5c58db855b02ed46133255c0_drawkit-fast-food-colour.svg","drawkit/5c74932ba272b1537a7f2334_support-notes-colour.svg","drawkit/5c80a29f0119be7090bc7e08_shopping-cart-colour.svg","drawkit/5c80a8640119be490fbc8770_carry-on.svg","drawkit/5c80a770ab24dc060e7bb7fb_carry-on-colour.svg","drawkit/5c95790211cd0dcccb7aaef3_travel-tickets-colour.svg","drawkit/5c908e0ea5701d29399dab32_storefront-colour.svg","drawkit/5ca568049a78ea786d159fdc_shipping-package-colour.svg","drawkit/5cc11740198b8d79d5c41595_pet-toys-colour.svg","drawkit/5ca6dfa17fb859d2fa1fa796_dog-colour.svg","drawkit/5cf90eb78e7d8a7004e01097_student-colour.svg","drawkit/5cf9c61080918118f65f1fad_food-delivery-colour.svg","drawkit/5cd1095392fac9ada3178d8b_schoolbooks-colour.svg","drawkit/5d00730bec964676b82a1182_photographer-colour.svg","drawkit/5cfc5a87982a741c64ef91d1_headphones-colour.svg","drawkit/5d0212a83f3338ae01c66e4b_calendar-colour.svg","drawkit/5d09d6e19c7900756ada9103_ticket-colour.svg","drawkit/5d12fbb511126003d2c4acd0_reading-corner-colour.svg","drawkit/5d12fd7f99bb70bce60bdbe3_entryway-colour.svg","drawkit/5d1d688effdd168a6d30ffbd_gameboy-colour.svg","drawkit/5d256cacad8c0c64b25fc91d_directions-colour.svg","drawkit/5d1d7d72a9dee46e119189f6_gamer-colour.svg","drawkit/5d26c09d33fe1c87f61115e8_map-colour.svg","drawkit/5d2d9db1b4a76d3fb0398a29_unlock.svg"];
        
        
        
        $(".lc-vectorial-images").append(  lc_list_images(undraw_images_array,"Undraw","View and grab more similar great images at <a href='https://undraw.co' target='_blank'>UnDraw.co</a>")  );
        $(".lc-vectorial-images").append(  lc_list_images(isometric_images_array,"Isometric","Order custom isometric images at <a href='https://isometric.online/contact/' target='_blank'>https://isometric.online/</a>")  );
        $(".lc-vectorial-images").append(  lc_list_images(drawkit_images_array,"Drawkit","Order custom illustrations at <a href='https://www.drawkit.io/custom' target='_blank'>https://www.drawkit.io/</a>")  );
        $(".lc-vectorial-images").append(  lc_list_images(lukas_images_array,"Lukasz Adam","Enquire for more similar great images at <a href='https://lukaszadam.com/' target='_blank'>lukaszadam.com</a>")  );
       
         
         ///LAZYLOAD///////
        const targets = document.querySelectorAll('.lc-vectorial-images img');
     
        const lazyLoad = target => {
            const io = new IntersectionObserver((entries, observer) => { 
            entries.forEach(entry => { 
         
               if (entry.isIntersecting) {
                 const img = entry.target;
                 const src = img.getAttribute('data-lazy');
         
                 img.setAttribute('src', src);
                 img.classList.add('fade');
         
                 observer.disconnect();
               }
            });
            });
         
            io.observe(target);
        };
         
        targets.forEach(lazyLoad);
        //END LAZYLOAD 

        
    }); // end on click
          
          
          
          
    ///WHEN UNDRAW PREVIEW IMAGE IS CLICKED, PLACE IT IN THE DOCUMENT  
    $("#sidepanel").on("click",".lc-vectorial-images ul li a", function (event) {
        event.preventDefault(); 
        var current_section=$(this).closest("section");
		var img_url=$(this).find("img").attr("data-lazy");
        
        //reset sizes and srcset fields
        current_section.find(" *[attribute-name='width'],  *[attribute-name='height'], *[attribute-name='srcset'], *[attribute-name='sizes'] ").val('').change();

        //set image url
		current_section.find(" input[attribute-name='src'], input[name='background-image']").val(img_url).change();
        
       });
   
   
    //////////////////////////////////////////////////////  SHORTCODES ////////////////////////////////////////////////////////////////////////////////////////////////////////////
     
    //ONCHANGE OF INPUTS, UPDATE SHORTCODE/////////
    $("body").on("change", "#sidepanel section[item-type=shortcode] *[name=shortcode_text]",function(e){
        e.preventDefault();
        //var theSection=$(this).closest("section[selector]");
        var selector=$(this).closest("section[selector]").attr("selector");

        doc.querySelector(selector).innerHTML=$(this).val();
    
        render_shortcode(selector, getPageHTML(selector)); 
    });
    
    
    /*********** POSTLIST SHORTCODES ******************/
    
    //ONCHANGE OF INPUTS, UPDATE SHORTCODE/////////
    $("body").on("change ", "#sidepanel section[item-type=posts-loop] *[name]",function(){
        
        var theSection=$(this).closest("section[selector]");
        var selector=$(this).closest("section[selector]").attr("selector");
        var theShortcode=doc.querySelector(selector).innerHTML;
        
        ///build shortcode parameters:init
        var shortcode_params=''; 
        theSection.find("*[name]").each(function(index, el) {
            var fieldValue=jQuery(el).val();
            var fieldName=jQuery(el).attr("name");
            
            if (fieldValue===null) fieldValue=lc_get_parameter_value_from_shortcode(fieldName,theShortcode); //uncommented on 1.8.2
            if (fieldValue!="") shortcode_params+=jQuery(el).attr("name")+'="'+fieldValue+'" ';
        });
        //update shortcode
        doc.querySelector(selector).innerHTML='[lc_get_posts '+shortcode_params+']';
        
        //update live preview
        //updatePreviewSectorial(selector);
        
        render_shortcode(selector, getPageHTML(selector)); 
    });
    
    //////////////////////////////////////////////////////  EMBED / VIDEO ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    $("body").on("change",'section[item-type=video-embed] form input[name=src_url]',function(){
        //OEMBED
        //$("#previewiframe").addClass("lc-block-pointer-events");
        $.post(
				lc_editor_saving_url, 
				{
					'action': 'lc_process_oembed',
                    'src_url': $(this).val(),
					//'lc_main_save_nonce_field': $("#lc_main_save_nonce_field").val(),
				}, 
				function(response) {
					//console.log('The server responded: ', response);
					if (true){
                        //success
                        //$("#previewiframe").removeClass("lc-block-pointer-events");
                        var selector=$("section[item-type=video-embed] form").closest("section").attr("selector");
                        if (response==="") {swal("Wrong URL. Please use the straight video page URL");return;}
                        setAttributeValue(selector+" iframe","src",response);
                        updatePreviewSectorial(selector);		
						}
				
				}
		);
        
    }); //end on change

	//iframe src field change
    $("body").on("change",'section[item-type=video-embed] form input[name=iframe_src]',function(){
		event.preventDefault(); 
        var selector=$(this).closest("section[selector]").attr("selector"); 
        setAttributeValue(selector+" iframe","src", ($(this).val()));
        updatePreviewSectorial(selector);
    }); //end on change
    
    //embed_presets
    //ON INPUT CHANGE, update HTML
    $('#sidepanel').on('change', 'section[item-type=video-embed] select[name=embed_presets]', function (event) {    
        event.preventDefault();
        $(this).closest("section[selector]").find("input[name=src_url]").val($(this).val()).change();
	}); //end function
    
    
    //////////// GMAPS /////////////////////////////////////////////////////////////////////////////////
 
    //ON INPUT CHANGE, update HTML
    $('#sidepanel').on('change', 'section[item-type=gmap-embed] input', function (event) {    
        event.preventDefault();
        var selector=$(this).closest("section[selector]").attr("selector");
        var theSection=$(this).closest("section[selector]");
        var address=theSection.find("input[name='address']").val();
        var zoom=theSection.find("input[name='zoom']").val();
        var iframe_url="https://maps.google.com/maps?q="+encodeURIComponent(address)+"&t=m&z="+zoom+"&output=embed&iwloc=near";
        setAttributeValue(selector+" iframe","src",iframe_url);
        updatePreviewSectorial(selector);
	}); //end function
    
    
    ////////////////VIDEO BACKGROUND /////////////////////////////////
    
    //ON INPUT CHANGE, update HTML
    $('#sidepanel').on('change', 'section[item-type=video-bg] input[name=video_mp4_url]', function (event) {    
        event.preventDefault();
        var selector=$(this).closest("section[selector]").attr("selector"); 
        setAttributeValue(selector+" video source","src", ($(this).val()));
        updatePreviewSectorial(selector);
	}); //end function
    
    //video_mp4_url_presets
    //ON INPUT CHANGE, update HTML
    $('#sidepanel').on('change', 'section[item-type=video-bg] select[name=video_mp4_url_presets]', function (event) {    
        event.preventDefault();
        $(this).closest("section[selector]").find("input[name=video_mp4_url]").val($(this).val()).change();
        //$(this).closest("section[selector]").find("input[name=video_mp4_url]").val($(this).find("option:selected").val()).change();
	}); //end function
    
    
     
   
   
    //////////////////////////////////////////////////////  AOS ANIMATIONS ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    
    //ON INPUT CHANGE, update HTML
    $("body").on("change",'#sidepanel *[attribute-name^=data-aos]',function(){
        
		//alert();
        //before doing it, check if AOS is loaded
        if (previewFrame.contents().find("body").attr("data-aos-easing")===undefined) {swal("In order to use this feature, you need to enable the AOS library in the LiveCanvas backend settings."); return;}
        
    }); //end on change
    

    //////////////////////////////////////////////////////  VERTICAL ALIGNMENT ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    
    function element_has_class_starting_with(el, class_beginning){
        return (" " + el.className+ " ").includes(" " + class_beginning);
    }
    /*

    //ON INPUT CHANGE, add necessary classes // good example of vars // interesting example
    $("body").on("change",'#sidepanel *[name=flex_align_item_classes]',function(){
        
        var theSection=$(this).closest("section[selector]");
        var selector = $(this).closest("[selector]").attr("selector");
        var elem = doc.querySelector(selector);
        //var preview_el=previewFrame.contents().find(selector);

        if ($(this).val()!="") {
            console.log("Set to not none");
            
            //check if height is given 
            if(!element_has_class_starting_with(elem, "min-vh-")) {
                console.log("no height is given, giving 100vh");
                theSection.find("*[name=min_height_classes] option[value=min-vh-100]").prop('selected', true).change();
            } else console.log("Height class already given");

            //check if flex is given
            if(!elem.matches(".d-flex")) {
                console.log("no flex is given, adding .d-flex");
                var current_classes=theSection.find("input[attribute-name=class]").val();
                theSection.find("input[attribute-name=class]").val(current_classes+ " d-flex").change();

            } else console.log("flex class already given");


        } else {
            console.log("Set to none");
            //remove flex and min-vh-100
            var current_classes=theSection.find("input[attribute-name=class]").val();
            theSection.find("input[attribute-name=class]").val(current_classes.replace('d-flex','').trim()).change();
            if(elem.matches(".min-vh-100")) theSection.find("*[name=min_height_classes] option:first").prop('selected', true).change();
        }
 
        
    }); //end on change
    */



}); //end doc ready
