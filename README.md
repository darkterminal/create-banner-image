# Create Banner Image - Github Action & Rest API
An easy way to make banners from articles that you make with only 1 step!

## Generator Usage
```javascript
const generator = async () => {
    const generated = await generateMainImage('metaphor-website-is-live', [ '#fc00ff', '#00dbde' ], 'Metaphor Website Is Live!', 'open-source', '🎉')
    console.log(generated)
}
generator()
```

## REST API Usage
```curl
curl -X POST \
  'https://<base-url>/generator' \
  --header 'Accept: */*' \
  --header 'Content-Type: application/json' \
  --data-raw '{
  "canonicalName": "metaphor-website-live",
  "articleName": "Metaphor Website Live",
  "gradientColors": ["#fc00ff","#00dbde"],
  "articleCategory": "open-sorce",
  "emoji": "🎉"
}'
```