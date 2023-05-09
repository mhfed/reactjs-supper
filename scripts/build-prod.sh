# echo "console.log('%c$(date +"%H:%M %d/%m/%Y")', 'color: #0f0;font-size:36px')" > public/build-version.js
rm -rf build/

nextBundle='iress-wealth-management-prod'
currentBundle='iress-wealth-management-dev'
sed -i -e "s/$currentBundle/$nextBundle/g" .firebaserc

nextBundle="`date +'%b %d %Y %H:%M:%S'`"
currentBundle="BUILD_TIME"
sed -i -e "s/$currentBundle/$nextBundle/g" src/layouts/MainLayout/Navbar/Version.tsx
echo "console.log('%c$(date +"%H:%M %d/%m/%Y")', 'color: #0f0;font-size:36px')" > public/info.js