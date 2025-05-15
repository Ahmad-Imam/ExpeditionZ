# ExpeditionZ

## Welcome to ExpeditionZ.

Live: https://expeditionz.vercel.app/

## Information

ExpeditionZ is a trip management platform built in Next.js, Prisma and NeonDB. It uses MapBox for location map and autumn, stripe for payments. The stripe and clerk are purposefully left in development mode as this is a hobby project.

## Frontend Instructions

1. Run npm install --legacy-peer-deps (Some package version conflict with React 19 and Next.js 15)
2. run npx prisma generate && next build
3. Enjoy !!!

## Application Features

1. Create and track your trips

2. Login via email or google to create or modify anything on the website.

3. You can share your trips with anyone without them having to create an account or become a member of your trip. Only the members can add/edit anything in a trip.

4. You can track your trip expenses in the expense tab. No more confusions about who pays what.

5. After creating the trip you can add or remove members who have an account in ExpeditionZ

6. You can add different types of checklists and assign members to them

7. You can create a timeline for your trip to maintain your trip sequences

8. Add any bucket list locations for your trip

9. You need to upgrade to premium user to use weather, info and gallery tabs. You can choose to pay monthly or yearly payment from the pricing page.

10. You can create polls for your trip members to decide on locations or any other decisions.

11. You can get weather information about your destination now and during your trip. You can also find local information and tips in the info tab.
    (Weather information might be inaccurate for trip weather if the date is too far)

12. You can add your images to the gallery tab. Every members need to be a premium user to access their own gallery tab.

## Sample Screenshots

| <img src="https://github.com/user-attachments/assets/d7a5f99a-4b2d-4198-84b2-f3cfb169e20d" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                   _HOME SCREEN_                                                    |

| <img src="https://github.com/user-attachments/assets/c2d6cf9a-54f2-4285-bb73-235acf6b54a0" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                               _TRIP DETAILS SCREEN_                                                |

| <img src="https://github.com/user-attachments/assets/ce4dc295-01a8-467a-8dfb-81d4b689706f" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                 _CHECKLIST SCREEN_                                                 |

| <img src="https://github.com/user-attachments/assets/fa1ca958-5034-4473-8715-2fed5d6649b3" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                 _TIMELINE SCREEN_                                                  |
|                                                                                                                    |

| <img src="https://github.com/user-attachments/assets/edb6db0c-7ef9-4578-8b5b-ddf018c4faac" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                 _LOCATION SCREEN_                                                  |
|                                                                                                                    |

| <img src="https://github.com/user-attachments/assets/0ce707d0-6798-4ad7-b98a-cc473a30cf1b" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                   _POLLS SCREEN_                                                   |
|                                                                                                                    |

| <img src="https://github.com/user-attachments/assets/01482619-e148-48b5-a808-10156290b57e" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                  _WEATHER SCREEN_                                                  |
|                                                                                                                    |

| <img src="https://github.com/user-attachments/assets/910ad637-f651-4b0c-8478-98db55b7e4c6" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                   _INFO SCREEN_                                                    |
|                                                                                                                    |

| <img src="https://github.com/user-attachments/assets/3ac52059-c280-4bf3-9bae-508ac64571e8" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                  _GALLERY SCREEN_                                                  |
|                                                                                                                    |

| <img src="https://github.com/user-attachments/assets/ad443642-9966-43ee-b9cb-cb2c0f16ac66" width=100% height=100%> |
| :----------------------------------------------------------------------------------------------------------------: |
|                                                  _PRICING SCREEN_                                                  |
|                                                                                                                    |

### Application Limitations

- Currently, it's not possible to delete a trip once created.
- Weather and Info tabs is dependant on GenAI api. If the service is down then no results to show
