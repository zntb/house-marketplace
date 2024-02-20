# Firebase Setup For House Marketplace

1. Create Firebase Project
2. Create "web" app within firebase to get config values"
3. Install firebase in your project "npm i firebase
4. Create a config file in your project
5. Add authentication for email/password and Google
6. Create [auth rules](https://gist.github.com/bradtraversy/6d7de7e877d169a6aa4e61140d25767f)
7. Create a user from Firebase
8. Enable Firestore
9. Create 3 composite indexes for advanced querying

#### First

- Collection: Listing
- Query Scope: Collection

| Field     |            |
| --------- | ---------- |
| type      | Ascending  |
| timestamp | Descending |

#### Second

- Collection: Listing
- Query Scope: Collection

| Field     |            |
| --------- | ---------- |
| userRef   | Ascending  |
| timestamp | Descending |

#### Third

- Collection: Listing
- Query Scope: Collection

| Field     |            |
| --------- | ---------- |
| offer     | Ascending  |
| timestamp | Descending |

10. Create dummy listing with sample data

| Field           | Value                                                                                                                                                                                                                                                                                                                             |
| --------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| name            | Beautiful Stratford Condo                                                                                                                                                                                                                                                                                                         |
| type            | rent                                                                                                                                                                                                                                                                                                                              |
| bedrooms        | 2                                                                                                                                                                                                                                                                                                                                 |
| userRef         | ID OF A USER                                                                                                                                                                                                                                                                                                                      |
| bathrooms       | 2                                                                                                                                                                                                                                                                                                                                 |
| parking         | true                                                                                                                                                                                                                                                                                                                              |
| furnished       | false                                                                                                                                                                                                                                                                                                                             |
| offer           | true                                                                                                                                                                                                                                                                                                                              |
| regularPrice    | 2500                                                                                                                                                                                                                                                                                                                              |
| discountedPrice | 2000                                                                                                                                                                                                                                                                                                                              |
| location        | 8601 West Peachtree St Stratford, CT 06614                                                                                                                                                                                                                                                                                        |
| geolocation     | **lat**: 41.205590 **lng**: -73.150530                                                                                                                                                                                                                                                                                            |
| imageUrls       | ['https://images.unsplash.com/photo-1586105251261-72a756497a11?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1258&q=80', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1470&q=80'] |

# Firebase Rules

**STORAGE RULES**

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read;
      allow write: if
      request.auth != null &&
      request.resource.size < 2 * 1024 * 1024 && //2MB
      request.resource.contentType.matches('image/.*')
    }
  }
}
```

**FIRESTORE RULES**

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Listings
    match /listings/{listing} {
    	allow read;
      allow create: if request.auth != null && request.resource.data.imgUrls.size() < 7;
    	allow delete: if resource.data.userRef == request.auth.uid;
    }

    // Users
    match /users/{user} {
    	allow read;
    	allow create;
    	allow update: if request.auth.uid == user
    }
  }
}
```
