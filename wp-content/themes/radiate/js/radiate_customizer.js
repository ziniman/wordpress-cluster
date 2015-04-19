/**
 * Theme Customizer related js
 */

jQuery(document).ready(function() {

   jQuery('.wp-full-overlay-sidebar-content').prepend('<a style="margin-top: 5px;margin-bottom: 5px; margin-left: 87px;"href="http://themegrill.com/themes/radiate-pro/" class="button" target="_blank">{pro}</a>'.replace('{pro}',radiate_customizer_obj.pro));
   jQuery('.wp-full-overlay-sidebar-content').prepend('<a style="margin-top: 5px;margin-bottom: 5px; margin-left: 106px;"href="http://themegrill.com/themes/radiate/" class="button" target="_blank">{info}</a>'.replace('{info}',radiate_customizer_obj.info));

});