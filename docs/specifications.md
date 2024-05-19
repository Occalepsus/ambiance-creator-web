### Objectif :

Diffuser des images ou des vidéos sur un site web.

### Composants

-   Liste des ambiances
    -   Voir la liste des ambiances
    -   Ajouter un ou plusieurs fichiers image ou vidéo via un bouton ou du drag and drop
-   Ambiance
    -   Nom
    -   Miniature
-   Écran métadonnées
    -   Nom
    -   Emplacement
    -   Type fichier
    -   Taille fichier
    -   Taille écran
    -   Ratio
    -   Durée vidéo
-   Actions ambiance
    -   Changer l'ambiance affichée
-   Écran d'ambiance
    -   Possibilité de ne voir que cet écran, ou voir la liste des ambiance aussi

### Architecture

-   `app/`
    -   `components/`
        -   `AmbianceBrowser.tsx`
        -   `AmbianceEntry.tsx`
        -   `ClientSocket.tsx`
        -   `FileUploader.tsx`
        -   `MainLayout.tsx`
        -   `PanelView.tsx`
        -   `Viewport.tsx`
        -   `components.module.scss`
    -   `ambianceManager.ts`
    -   `layout.tsx`
    -   `page.tsx`
    -   `globals.scss`
    -   `page.module.scss`

### Idées améliorations

-   Ressources en ligne (YouTube, cloud, etc...)- Enregistrer la playlist
