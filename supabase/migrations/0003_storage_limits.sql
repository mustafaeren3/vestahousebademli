-- Application code already validates image size/type before upload, but
-- that's bypassable by anyone calling the Storage API directly with a
-- valid admin session. Enforce the same limit at the bucket level too.
update storage.buckets
set
  file_size_limit = 5242880, -- 5 MB
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/gif']
where id = 'menu-images';
