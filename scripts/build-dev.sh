echo "console.log('%c$(date +"%H:%M %d/%m/%Y")', 'color: #0f0;font-size:36px')" > public/build-version.js

nextBundle="`date +'%b%d %Y %H:%M:%S'`"
currentBundle="BUILD_TIME"
sed -i -e "s/$currentBundle/$nextBundle/g" src/layouts/MainLayout/Navbar/Version.tsx