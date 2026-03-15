---
title: Blog
permalink: /Post Index/
layout: page
---

This page is the full writing archive.

<ul class="archive-list">
  {% for post in site.posts %}
    <li>
      <p class="post-meta"><a href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
      <time datetime="{{ post.date | date_to_xmlschema }}" itemprop="datePublished">{{ post.date | date: "%b %-d, %Y" }}</time></p>
    </li>
  {% endfor %}
</ul>
