import os


os.system('jekyll')

commit_message = raw_input('please input the commit message : ')


os.system('cp -r ./_site/* ./_site.github/')

os.system('cd ./_site.github/; git add ./*; git commit -m %s; git push' % commit_message)



