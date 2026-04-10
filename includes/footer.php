<?php
// FreeGeny — Footer HTML universel
?>
  </main><!-- /main-content -->

  <!-- Footer -->
  <footer class="footer">
    <div class="container">
      <div class="footer-grid">

        <!-- Brand -->
        <div class="footer-brand">
          <div class="footer-logo">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="#FF6B35"/>
              <text x="16" y="22" text-anchor="middle" fill="white" font-size="18" font-weight="bold" font-family="Inter">F</text>
            </svg>
            <span>FreeGeny</span>
          </div>
          <p class="footer-tagline"><?= t('hero.badge') ?></p>
          <div class="footer-social">
            <a href="https://facebook.com/freegeny" target="_blank" rel="noopener" aria-label="Facebook" class="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
            <a href="https://instagram.com/freegeny" target="_blank" rel="noopener" aria-label="Instagram" class="social-link">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/></svg>
            </a>
          </div>
        </div>

        <!-- Liens -->
        <div class="footer-col">
          <h4 class="footer-heading">Matières</h4>
          <ul class="footer-links">
            <li><a href="<?= APP_URL ?>/algeria/1ap/arabe">Arabe 1AP</a></li>
            <li><a href="<?= APP_URL ?>/algeria/1ap/mathematiques">Maths 1AP</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">FreeGeny</h4>
          <ul class="footer-links">
            <li><a href="<?= APP_URL ?>/auth/register">S'inscrire</a></li>
            <li><a href="<?= APP_URL ?>/auth/login">Connexion</a></li>
            <li><a href="<?= APP_URL ?>/dashboard/parent">Tableau de bord</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="footer-heading">Légal</h4>
          <ul class="footer-links">
            <li><a href="<?= APP_URL ?>/privacy">Confidentialité</a></li>
            <li><a href="<?= APP_URL ?>/terms">Conditions</a></li>
            <li><a href="<?= APP_URL ?>/contact">Contact</a></li>
          </ul>
        </div>

      </div>

      <div class="footer-bottom">
        <p><?= t('footer.rights', ['year' => APP_YEAR]) ?></p>
        <p class="footer-men">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Conforme au programme officiel du Ministère de l'Éducation Nationale — Algérie
        </p>
      </div>
    </div>
  </footer>

  <!-- Scripts -->
  <script src="<?= ASSETS_URL ?>/js/app.js?v=<?= APP_VERSION ?>"></script>

  <?php if (isset($extraScripts)) echo $extraScripts; ?>

</body>
</html>
