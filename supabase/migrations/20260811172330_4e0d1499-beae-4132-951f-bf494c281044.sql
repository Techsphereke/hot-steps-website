UPDATE public.properties SET image = '/media/' || regexp_replace(image, '^.*/', '') WHERE image LIKE 'http%hotstepsholdings.co.ke%';
UPDATE public.posts SET image = '/media/' || regexp_replace(image, '^.*/', '') WHERE image LIKE 'http%hotstepsholdings.co.ke%';
UPDATE public.awards SET image = '/media/' || regexp_replace(image, '^.*/', '') WHERE image LIKE 'http%hotstepsholdings.co.ke%';
UPDATE public.team_members SET image = '/media/' || regexp_replace(image, '^.*/', '') WHERE image LIKE 'http%hotstepsholdings.co.ke%';
UPDATE public.hero_slides SET image = '/media/' || regexp_replace(image, '^.*/', '') WHERE image LIKE 'http%hotstepsholdings.co.ke%';