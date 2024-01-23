import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from './Dialog';

import { Button } from '../button/Button';
import { TextInput } from '../text-input/TextInput';

export function DialogExample(args: any) {
  return (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile Dialog</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <TextInput label="Name" defaultValue="Pedro Duarte" />
          <TextInput label="User name" defaultValue="@peduarte" />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DialogNoHeader() {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent>
        <div className="grid gap-4 py-4">
          <TextInput label="Name" defaultValue="Pedro Duarte" />
          <TextInput label="User name" defaultValue="@peduarte" />
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function DialogScrollable() {
  return (
    <Dialog defaultOpen={true}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Long scrollable text dialog</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Be bold
            </h3>
            <p className="mt-1 text-gray-800 dark:text-gray-400">
              Motivate teams to do their best work. Offer best practices to get
              users going in the right direction. Be bold and offer just enough
              help to get the work started, and then get out of the way. Give
              accurate information so users can make educated decisions. Know
              your user&apos;s struggles and desired outcomes and give just
              enough information to let them get where they need to go.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Be optimistic
            </h3>
            <p className="mt-1 text-gray-800 dark:text-gray-400">
              Focusing on the details gives people confidence in our products.
              Weave a consistent story across our fabric and be diligent about
              vocabulary across all messaging by being brand conscious across
              products to create a seamless flow across all the things. Let
              people know that they can jump in and start working expecting to
              find a dependable experience across all the things. Keep teams in
              the loop about what is happening by informing them of relevant
              features, products and opportunities for success. Be on the
              journey with them and highlight the key points that will help them
              the most - right now. Be in the moment by focusing attention on
              the important bits first.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Be practical, with a wink
            </h3>
            <p className="mt-1 text-gray-800 dark:text-gray-400">
              Keep our own story short and give teams just enough to get moving.
              Get to the point and be direct. Be concise - we tell the story of
              how we can help, but we do it directly and with purpose. Be on the
              lookout for opportunities and be quick to offer a helping hand. At
              the same time realize that nobody likes a nosy neighbor. Give the
              user just enough to know that something awesome is around the
              corner and then get out of the way. Write clear, accurate, and
              concise text that makes interfaces more usable and consistent -
              and builds trust. We strive to write text that is understandable
              by anyone, anywhere, regardless of their culture or language so
              that everyone feels they are part of the team.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Scroll inside viewport</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
