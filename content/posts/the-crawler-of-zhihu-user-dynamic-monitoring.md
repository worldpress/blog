---
title: 知乎用户动态监控爬虫
date: 2015-11-25 12:00:00
tags:
  - Python
  - 知乎
categories:
  - 技术文章
---

> 根据极客学院的Python爬虫教程写的一个单线程简易爬虫。可以监控知乎用户动态，当有新动态时发送邮件通知。

#### 步骤
- 根据要关注的知乎用户的主页URL，使用requests模块获取整个用户主页的html。
- 根据用户主页及其html代码，定位所需要的最新动态的位置。
- 使用正则表达式比配到需要的数据。
- 拼接数据，判断是否已经保持在文件中，即判断是否为新动态。
- 若是新动态，使用python的smtplib模块发送收件到设置的邮箱中并保存到本地文件，否则略过。

<!--more-->
#### 模块
`os`
`time`
`re`
`sys`
`MIMEText`
`requests`
`smtplib`
<!--more-->

#### zhihu类：获取与匹配，保持内容

```
class zhihu(object):

    def __init__(self):
        # 设置关注的知乎用户
        self.url = "http://www.zhihu.com/people/xxxx"
        # 设置request header
        self.header = {
            'Host' : 'www.zhihu.com',
            'Connection' : 'Keep-Alive',
            'Accept' : 'text/html, application/xhtml+xml, image/jxr, */*',
            'User-Agent' : 'Mozilla/5.0 (Windows NT 6.2; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2490.80 Safari/537.36',
            'Referer': self.url
        }
        # 设置登录的Cookie
        self.cookie = {
            'Cookie' : ''
        }

    # 获取知乎用户的主页HTML
    def getHTML(self):
        html = requests.get(self.url, headers = self.header, cookies = self.cookie).content
        return html

    # 获取最新动态
    def getContent(self, html):
        self.name = re.findall('<span class="name">(.*?)</span>', html, re.S)[0]
        content = re.findall('<div class="zm-profile-section-main zm-profile-section-activity-main zm-profile-activity-page-item-main">(.*?)</div>', html, re.S)
        return content

    # 获取每一条最新动态
    def getText(self, contents):
        data = {}
        data['href'] = re.findall('href="/question/(.*?)"', contents, re.S)
        data['question'] = re.findall('<a class="question_link" .*?">(.*?)</a>', contents, re.S)
        restr = '">'+ self.name +'</a>(.*?)\n\n<a'
        data['action'] = re.findall(restr, contents, re.S)
        text = self.name + data['action'] + ': ' +  data['question'] + ' http://www.zhihu.com/question/'+ data['href'] + '\n'
        return text

    # 保存到文本
    def toSave(self, text):
        f = open('zhihu.txt', 'a')
        f.write(text)
        f.close()

    # 检查动态是否已记录
    def toCheck(self, text):
        f = open('zhihu.txt', 'r')
        existzhihu = f.readlines()
        if text in existzhihu:
            return False
        else:
            return True
```

#### mail类：发送邮件

```
class mail(object):

    def __init__(self):
        #邮件服务器地址，需要打开smtp
        self.mail_host = "smtp.xxx.cn"
        #邮件账号
        self.mail_user = ""
        #邮箱密码
        self.mail_pass = ""
        #邮箱后缀
        self.mail_postfix = "xxx.com"

    def sendMail(self, toList, sub, content):
        #发信人
        me = "zhihu spider" + "<" + self.mail_user + "@" + self.mail_postfix + ">"
        msg = MIMEText(content, _subtype='plain', _charset='utf-8')
         #邮件标题
        msg['Subject'] = sub
        #邮件发送人
        msg['From'] = me
        #邮件收件人
        msg['To'] = ";".join(toList)
        try:
            server = smtplib.SMTP()
            #连接服务器
            server.connect(self.mail_host)
            #登录邮箱
            server.login(self.mail_user,self.mail_pass)
            #发送邮件
            server.sendmail(me, toList, msg.as_string())
            server.close()
            return True
        except Exception, e:
            print str(e)
            return False

```

#### 运行

```
if __name__ == '__main__':
    # 设置收件人邮箱
    mailToList = ['xxx@xxx.com']
    zhihu = zhihu();
    while True:
        html = zhihu.getHTML()
        content = zhihu.getContent(html)
        # 若没有动态记录，爬取所有动态，并保存
        if not os.path.exists('zhihu.txt'):
            for contents in content:
                text = zhihu.getText(contents)
                zhihu.toSave(text)
        else:
            text = zhihu.getText(content[0])
            print text
            # 检查是否存在记录， 不存在则发送邮件，并保存到文件
            if zhihu.toCheck(text):
                if mail().sendMail(mailToList, "知乎动态", text):
                    zhihu.toSave(text)
                    print "发生成功"
                else:
                    print "发送失败"
            else:
                print "pass"
            # 每隔2分钟运行一次，检查新动态
            time.sleep(120)
```

#### 总结
这个简单的爬虫目前还没有办法同时关注很多用户，然后对ip也没有进行代理，爬取过于频繁的话可能会被封ip而爬取不到。

在爬取知乎的过程中发现如果没有header,可能返回的html页面不是用户的主页。然后如果没有登录的话，看到的知乎用户的主页刷新缓慢。需要模拟登录后才能够实时刷新出新动态。

同时使用的是re库正则匹配内容，在使用上不是很方便。但是对xpath又不是很熟，所以暂时使用正则取匹配。

之前还有看到一个解析html内容的模块叫BeautifulSoup，准备去学习学习。然后打算下次使用pythopn的爬虫框架Scrapy来写更多功能的知乎爬虫。
