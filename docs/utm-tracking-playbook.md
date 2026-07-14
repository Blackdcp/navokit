# NavoKit UTM Tracking Playbook

This document defines how NavoKit tags external links so traffic can be read correctly in GA4.

## Core rule

Use UTM links for external promotion only.

Do not add UTM parameters to internal navigation links inside navokit.com. Internal UTMs can overwrite the original acquisition source and make GA4 attribution messy.

## Standard parameters

| Parameter | Required | Rule | Example |
| --- | --- | --- | --- |
| `utm_source` | Yes | Where the link is posted. Lowercase, no spaces. | `x`, `reddit`, `producthunt`, `linkedin`, `hackernews` |
| `utm_medium` | Yes | Traffic type. Keep the list small. | `social`, `community`, `email`, `referral`, `launch` |
| `utm_campaign` | Yes | What we are testing or promoting. | `markdown_to_image_launch` |
| `utm_content` | Recommended | Creative or placement variant. | `text_post_v1`, `demo_card_v1`, `profile_link` |
| `utm_term` | Usually no | Use only for paid keywords. | `markdown to image` |

## Naming rules

- Use lowercase English.
- Use underscores, not spaces.
- Keep campaign names stable for a campaign window.
- Put creative variations in `utm_content`, not in `utm_campaign`.
- Do not use Chinese campaign names in UTMs.

Good:

```txt
utm_source=x
utm_medium=social
utm_campaign=markdown_to_image_launch
utm_content=text_post_v1
```

Avoid:

```txt
utm_source=Twitter
utm_medium=post
utm_campaign=markdown launch x version today
utm_content=我的第一条推文
```

## Source and medium map

| Channel | `utm_source` | `utm_medium` |
| --- | --- | --- |
| X / Twitter post | `x` | `social` |
| X / Twitter profile link | `x` | `social` |
| LinkedIn post | `linkedin` | `social` |
| Reddit post or comment | `reddit` | `community` |
| Hacker News | `hackernews` | `community` |
| Product Hunt | `producthunt` | `launch` |
| Indie Hackers | `indiehackers` | `community` |
| YouTube description | `youtube` | `social` |
| Newsletter | `newsletter` | `email` |
| Direct outreach / DM | `direct_message` | `referral` |
| Jike / 即刻 | `jike` | `social` |
| WeChat / 微信 | `wechat` | `social` |

## Campaign names

Use one campaign name per promotion objective.

| Objective | Campaign |
| --- | --- |
| Launch / promote Markdown to Image | `markdown_to_image_launch` |
| Validate Markdown to Image demand | `markdown_to_image_validation` |
| Promote AI Video Generator | `ai_video_generator_launch` |
| Validate AI Video prompt demand | `ai_video_validation` |
| Promote Social Booster | `social_booster_launch` |
| Validate social copy demand | `social_booster_validation` |
| General NavoKit launch | `navokit_launch` |

## Content names

Use `utm_content` to distinguish creative formats and placements.

| Scenario | `utm_content` |
| --- | --- |
| Plain text post | `text_post_v1` |
| Image card post | `image_card_v1` |
| Demo video | `demo_video_v1` |
| Reply under another post | `reply_v1` |
| Profile bio link | `profile_link` |
| Product screenshot | `screenshot_v1` |
| Comparison post | `comparison_v1` |
| Tutorial post | `tutorial_v1` |

## Ready-to-use links

### Markdown to Image

X text post:

```txt
https://www.navokit.com/en/tools/markdown-to-image?utm_source=x&utm_medium=social&utm_campaign=markdown_to_image_launch&utm_content=text_post_v1
```

X image card post:

```txt
https://www.navokit.com/en/tools/markdown-to-image?utm_source=x&utm_medium=social&utm_campaign=markdown_to_image_launch&utm_content=image_card_v1
```

X profile link:

```txt
https://www.navokit.com/en/tools/markdown-to-image?utm_source=x&utm_medium=social&utm_campaign=markdown_to_image_launch&utm_content=profile_link
```

Reddit useful reply:

```txt
https://www.navokit.com/en/tools/markdown-to-image?utm_source=reddit&utm_medium=community&utm_campaign=markdown_to_image_validation&utm_content=reply_v1
```

### Free AI Video Generator

X demo clip:

```txt
https://www.navokit.com/en/tools/free-ai-video-generator?utm_source=x&utm_medium=social&utm_campaign=ai_video_generator_launch&utm_content=demo_video_v1
```

Reddit prompt discussion:

```txt
https://www.navokit.com/en/tools/free-ai-video-generator?utm_source=reddit&utm_medium=community&utm_campaign=ai_video_validation&utm_content=reply_v1
```

Product Hunt launch:

```txt
https://www.navokit.com/en/tools/free-ai-video-generator?utm_source=producthunt&utm_medium=launch&utm_campaign=ai_video_generator_launch&utm_content=launch_page
```

### AI Social Post Generator

X post:

```txt
https://www.navokit.com/en/tools/ai-social-booster?utm_source=x&utm_medium=social&utm_campaign=social_booster_launch&utm_content=text_post_v1
```

LinkedIn post:

```txt
https://www.navokit.com/en/tools/ai-social-booster?utm_source=linkedin&utm_medium=social&utm_campaign=social_booster_launch&utm_content=text_post_v1
```

Reddit creator workflow reply:

```txt
https://www.navokit.com/en/tools/ai-social-booster?utm_source=reddit&utm_medium=community&utm_campaign=social_booster_validation&utm_content=reply_v1
```

### Homepage

General NavoKit launch:

```txt
https://www.navokit.com/en?utm_source=x&utm_medium=social&utm_campaign=navokit_launch&utm_content=text_post_v1
```

## How to read this in GA4

In GA4, check:

- Reports → Acquisition → Traffic acquisition
- Dimension: Session source / medium
- Secondary dimension: Session campaign
- For tool usage, compare campaign traffic with events:
  - `tool_markdown_export_succeeded`
  - `tool_social_generate_succeeded`
  - `tool_ai_video_submit_succeeded`
  - `tool_ai_video_generation_succeeded`

The useful metric is not only visits. The useful metric is:

```txt
external click → tool page view → tool action → successful output
```

## Weekly review habit

Once a week, record:

| Campaign | Source / medium | Users | Tool success event | Notes |
| --- | --- | ---: | ---: | --- |
| `markdown_to_image_launch` | `x / social` |  |  |  |
| `markdown_to_image_validation` | `reddit / community` |  |  |  |
| `ai_video_generator_launch` | `x / social` |  |  |  |
| `social_booster_launch` | `linkedin / social` |  |  |  |

If a source brings visits but no tool actions, the message may be wrong or the audience may be weak.

If a source brings few visits but high tool actions, keep testing that audience.
