# Data Models: 

## Users

| Property | Type | Description | 
| --- | --- | --- |
| id | number | Unique identifier for the user |
| createdAt | dateTime | Date and time the user was created |
| updatedAt | dateTime | Date and time the user was last updated |
| email | string | Email address of the user |
| hash | string | Hashed password of the user |
| firstName (optional) | string | First name of the user |
| lastName (optional) | string | Last name of the user |
| bookmarks | array | Array of bookmark ids |

## Bookmarks

| Property | Type | Description |
| --- | --- | --- |
| id | number | Unique identifier for the bookmark |
| createdAt | dateTime | Date and time the bookmark was created |
| updatedAt | dateTime | Date and time the bookmark was last updated |
| title | string | Title of the bookmark |
| description (optional) | string | Description of the bookmark |
| link | string | Link of the bookmark |
| userId | number | Id of the user who created the bookmark |


