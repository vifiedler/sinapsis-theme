<?php
/**
 * Navigation Template - Topbar Elements Only
 * @package breakdownmusic-theme
 */
?>

<div class="bd-topbar-left d-flex align-items-center gap-3">
    <button id="bd-burger" class="bd-burger-btn" aria-label="Alternar menú">
        <i class="bi bi-list"></i>
    </button>

    <div class="bd-logo-wrap d-flex align-items-center">
        <?php 
        if ( has_custom_logo() ) {
            the_custom_logo(); 
        } else {
            // Logo por defecto forzado a flex para evitar úcono encima del texto
            echo '<a href="' . esc_url(home_url('/')) . '" class="text-white text-decoration-none fw-bold d-flex align-items-center gap-2 m-0 p-0" style="font-size: 1.2rem; font-family: var(--bd-font-logo, sans-serif);">';
            echo '<i class="bi bi-play-circle-fill text-danger" style="font-size: 1.5rem;"></i> <span style="line-height: 1;">Breakdown</span>';
            echo '</a>';
        }
        ?>
    </div>
</div>

<div class="bd-topbar-search">
    <?php get_search_form(); ?>
</div>