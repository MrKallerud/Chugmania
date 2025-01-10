import LoginManager from '@/server/managers/login.manager'
import UserManager from '@/server/managers/user.manager'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load = (async ({ params, locals }) => {
  const { user: currentUser } = locals
  const { user: lookupUserId } = params
  if (!currentUser) throw new Error('Unauthorized')

  const isCurrentUser = currentUser.id === lookupUserId
  const user = isCurrentUser ? currentUser : await UserManager.getUserById(params.user)

  return { user, currentUser, isCurrentUser }
}) satisfies PageServerLoad

export const actions = {
  update: async ({ request, locals, cookies }) => {
    const form = await request.formData()
    try {
      if (locals.user?.role !== 'admin' && form.get('id') !== locals.user?.id)
        throw new Error('Unauthorized')
      await UserManager.update(form)
      if (locals.user?.id === form.get('id')) {
        LoginManager.refresh(cookies)
      }
    } catch (e) {
      if (!(e instanceof Error)) throw e
      console.error(e)
      return fail(400, {
        success: false,
        message: `Failed to update user '${form.get('id')}'\n` + e.message,
      })
    }
  },
  delete: async ({ request, locals }) => {
    const form = await request.formData()
    try {
      if (locals.user?.role !== 'admin') throw new Error('Unauthorized')
      await UserManager.delete(form)
      throw redirect(303, '/users')
    } catch (e) {
      if (!(e instanceof Error)) throw e
      console.error(e)
      return fail(400, {
        success: false,
        message: `Failed to delete user '${form.get('id')}'\n` + e.message,
      })
    }
  },
  logout: async ({ cookies }) => LoginManager.logout(cookies),
} satisfies Actions
