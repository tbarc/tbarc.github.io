---
title: Post Index
permalink: /Post Index/
layout: page
---
<ul>
  {% for post in site.posts %}
    <li>
      <p class="post-meta"><a href="{{ post.url }}">{{ post.title }}</a>
      <time datetime="{{ post.date | date_to_xmlschema }}" itemprop="datePublished">{{ post.date | date: "%b %-d, %Y" }}</time></p>
    </li>
  {% endfor %}
</ul>
