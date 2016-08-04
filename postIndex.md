---
title: Post Index
permalink: /Post Index/
layout: page
---
<ul>
  {% for post in site.posts %}
    <li>
      <a href="{{ post.url }}">{{ post.title }}</a> {{ page.date | date: '%B %d, %Y' }}
    </li>
  {% endfor %}
</ul>
