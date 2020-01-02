cat <<EOF > .git/hooks/pre-commit  
npm run allTest
if [ \$? != 0 ]; then 
echo "fix the tests"
    exit 1
fi
EOF


chmod +x .git/hooks/pre-commit  

cat <<EOF > .git/hooks/pre-push  
npm run allTest 
if [ \$? != 0 ]; then 
echo "fix the test"
    exit 1
fi
EOF


chmod +x .git/hooks/pre-push