REVOKE ALL ON FUNCTION public.has_role(UUID, public.app_role) FROM public;
REVOKE ALL ON FUNCTION public.update_updated_at_column() FROM public;
REVOKE ALL ON FUNCTION public.handle_new_user() FROM public;
GRANT EXECUTE ON FUNCTION public.has_role(UUID, public.app_role) TO authenticated;