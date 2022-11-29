const responsive ={
   0:{
    items:1
   },
   320:{
      items:1
   },
   550:{
      items:2
   },
   960:{
      items:3
   }

}

$(document).ready(function(){
 $nav=$('.navbar');
 $toggle=$('.toggle');
 /*----click event*/
 $toggle.click(function(){
    $nav.toggleClass('collapse');
 })
// owl-carosel blog

$('.owl-carousel').owlCarousel({
   loop:true,
   autoplay:true,
   autoplayTimeout: 4000,
   dots: false,
   nav: true,
   navText: [$('.owl-navigation .owl-nav-prev'),$('.owl-navigation .owl-nav-next')],
   responsive:responsive
});

//scroll up
$('.move-up span').click(function(){
   $('html,body').animate({
      scrollTop: 0
   },1000);
})
//animation instance
AOS.init();
});
$(document).ready(function(){
   $(".invisibe-content").hide();
   $(document).on('click',"#btn-post",function(){
     var moreLess =$(".invisibe-content").is(":visible")?`Read More`:`Read Less`;
     
     $(this).text(moreLess);
     $(this).parent(".post-title").find(".invisibe-content").toggle();
     $(this).parent(".post-title").find(".visibe-content").toggle();
   });
  });